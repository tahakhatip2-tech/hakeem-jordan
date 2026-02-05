import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
    Building2,
    MapPin,
    Phone,
    Clock,
    Search,
    Calendar,
    MessageCircle,
    Loader2,
} from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export default function PatientClinics() {
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [clinics, setClinics] = useState<any[]>([]);
    const [filteredClinics, setFilteredClinics] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedClinic, setSelectedClinic] = useState<any>(null);
    const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [bookingData, setBookingData] = useState({
        appointmentDate: '',
        notes: '',
    });

    useEffect(() => {
        fetchClinics();
    }, []);

    useEffect(() => {
        if (searchTerm) {
            const filtered = clinics.filter(
                (clinic) =>
                    clinic.clinic_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    clinic.clinic_specialty?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    clinic.clinic_address?.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredClinics(filtered);
        } else {
            setFilteredClinics(clinics);
        }
    }, [searchTerm, clinics]);

    const fetchClinics = async () => {
        try {
            const token = localStorage.getItem('patient_token');
            const response = await axios.get(`${API_URL}/patient/clinics`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setClinics(response.data);
            setFilteredClinics(response.data);
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'خطأ',
                description: 'حدث خطأ أثناء تحميل العيادات',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleBookAppointment = (clinic: any) => {
        setSelectedClinic(clinic);
        setBookingDialogOpen(true);
        setBookingData({ appointmentDate: '', notes: '' });
    };

    const handleWhatsApp = (clinic: any) => {
        const phone = clinic.clinic_phone || clinic.phone;
        if (phone) {
            const formattedPhone = phone.replace(/\D/g, '');
            window.open(`https://wa.me/${formattedPhone}`, '_blank');
        }
    };

    const submitBooking = async () => {
        if (!bookingData.appointmentDate) {
            toast({
                variant: 'destructive',
                title: 'خطأ',
                description: 'يرجى اختيار تاريخ ووقت الموعد',
            });
            return;
        }

        setBookingLoading(true);
        try {
            const token = localStorage.getItem('patient_token');
            await axios.post(
                `${API_URL}/patient/appointments`,
                {
                    clinicId: selectedClinic.id,
                    appointmentDate: bookingData.appointmentDate,
                    notes: bookingData.notes,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            toast({
                title: 'تم إرسال طلب الموعد!',
                description: 'سيتم إشعارك عند تأكيد الطبيب للموعد',
            });

            setBookingDialogOpen(false);
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'خطأ في الحجز',
                description: error.response?.data?.message || 'حدث خطأ أثناء حجز الموعد',
            });
        } finally {
            setBookingLoading(false);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold mb-2">العيادات المتاحة</h1>
                <p className="text-muted-foreground">ابحث عن العيادة المناسبة واحجز موعدك</p>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="ابحث عن عيادة، تخصص، أو موقع..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pr-10"
                />
            </div>

            {/* Clinics Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <Skeleton key={i} className="h-64 w-full" />
                    ))}
                </div>
            ) : filteredClinics.length === 0 ? (
                <Card className="shadow-card">
                    <CardContent className="py-12 text-center">
                        <Building2 className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                        <h3 className="text-lg font-semibold mb-2">لا توجد عيادات</h3>
                        <p className="text-muted-foreground">
                            {searchTerm ? 'لم يتم العثور على نتائج للبحث' : 'لا توجد عيادات متاحة حالياً'}
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredClinics.map((clinic) => (
                        <Card
                            key={clinic.id}
                            className="shadow-card hover:shadow-glow transition-all group"
                        >
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <CardTitle className="text-xl mb-1">
                                            {clinic.clinic_name || clinic.name}
                                        </CardTitle>
                                        {clinic.clinic_specialty && (
                                            <Badge variant="secondary" className="mt-2">
                                                {clinic.clinic_specialty}
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {clinic.clinic_address && (
                                    <div className="flex items-start gap-2 text-sm text-muted-foreground">
                                        <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                        <span>{clinic.clinic_address}</span>
                                    </div>
                                )}

                                {(clinic.clinic_phone || clinic.phone) && (
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Phone className="h-4 w-4" />
                                        <span dir="ltr">{clinic.clinic_phone || clinic.phone}</span>
                                    </div>
                                )}

                                {clinic.working_hours && (
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Clock className="h-4 w-4" />
                                        <span>{clinic.working_hours}</span>
                                    </div>
                                )}

                                <div className="flex gap-2 pt-4">
                                    <Button
                                        className="flex-1 gradient-primary text-white shadow-glow"
                                        onClick={() => handleBookAppointment(clinic)}
                                    >
                                        <Calendar className="h-4 w-4 ml-2" />
                                        احجز موعد
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => handleWhatsApp(clinic)}
                                        className="hover:bg-success hover:text-white transition-colors"
                                    >
                                        <MessageCircle className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Booking Dialog */}
            <Dialog open={bookingDialogOpen} onOpenChange={setBookingDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>حجز موعد</DialogTitle>
                        <DialogDescription>
                            {selectedClinic?.clinic_name || selectedClinic?.name}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="appointmentDate">تاريخ ووقت الموعد *</Label>
                            <Input
                                id="appointmentDate"
                                type="datetime-local"
                                value={bookingData.appointmentDate}
                                onChange={(e) =>
                                    setBookingData({ ...bookingData, appointmentDate: e.target.value })
                                }
                                min={new Date().toISOString().slice(0, 16)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="notes">ملاحظات (اختياري)</Label>
                            <Textarea
                                id="notes"
                                placeholder="أضف أي ملاحظات أو تفاصيل إضافية..."
                                value={bookingData.notes}
                                onChange={(e) =>
                                    setBookingData({ ...bookingData, notes: e.target.value })
                                }
                                rows={3}
                            />
                        </div>

                        <div className="bg-muted/50 p-4 rounded-lg">
                            <p className="text-sm text-muted-foreground">
                                <strong>ملاحظة:</strong> سيتم إرسال طلب الموعد إلى الطبيب، وسيتم إشعارك عند
                                التأكيد.
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setBookingDialogOpen(false)}
                            className="flex-1"
                            disabled={bookingLoading}
                        >
                            إلغاء
                        </Button>
                        <Button
                            onClick={submitBooking}
                            className="flex-1 gradient-primary text-white"
                            disabled={bookingLoading}
                        >
                            {bookingLoading ? (
                                <>
                                    <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                                    جاري الحجز...
                                </>
                            ) : (
                                'تأكيد الحجز'
                            )}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
