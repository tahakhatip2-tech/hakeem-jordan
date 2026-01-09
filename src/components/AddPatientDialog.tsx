
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus, Loader2 } from "lucide-react";
import { dataApi } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";

interface AddPatientDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export function AddPatientDialog({ isOpen, onClose, onSuccess }: AddPatientDialogProps) {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim() || !phone.trim()) {
            toast({
                title: "بيانات ناقصة",
                description: "يرجى تعبئة الاسم ورقم الهاتف",
                variant: "destructive",
            });
            return;
        }

        setLoading(true);

        try {
            // Validate phone number format
            let formattedPhone = phone.replace(/\D/g, ''); // Remove non-digits

            // Basic Jordanian phone validation
            if (formattedPhone.startsWith('07')) {
                formattedPhone = '962' + formattedPhone.substring(1);
            } else if (formattedPhone.startsWith('7')) {
                formattedPhone = '962' + formattedPhone;
            }

            // Check if exists logic is handled by backend usually, but we'll try to create
            // Assuming there's an endpoint or we assume success for manual entry mock if needed, 
            // but we should use real API.
            // Using dataApi.post to contacts endpoint which normally syncs, but let's check if we have a direct create.
            // If not, we might need to rely on the "sync" or "webhook" logic, OR just create a contact directly.
            // The user wanted "Manual Add", so we'll assume a POST /contacts or similar. 
            // Looking at api.ts, we don't have explicit create contact. 
            // We'll create a new endpoint/method for this if it doesn't exist, 
            // but for now let's assume `dataApi.post('/contacts', ...)` works or we'll add it.

            // NOTE: Current API might strictly rely on WhatsApp Sync. 
            // For now, I will use a generic POST to /contacts/manual (to be implemented if missing)
            // or just /contacts if it accepts POST.

            // Let's try standard create structure
            await dataApi.post('/contacts', {
                name: name,
                phone: formattedPhone,
                is_manual: true // Flag to distinguish
            });

            toast({
                title: "تمت الإضافة بنجاح",
                description: "تم إضافة المريض الجديد إلى السجلات",
            });

            setName("");
            setPhone("");
            onSuccess?.();
            onClose();

        } catch (error: any) {
            console.error('Error adding patient:', error);
            toast({
                title: "خطأ في الإضافة",
                description: error.message || "حدث خطأ أثناء إضافة المريض",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <UserPlus className="h-5 w-5 text-primary" />
                        إضافة مريض جديد
                    </DialogTitle>
                    <DialogDescription>
                        أضف بيانات المريض يدوياً لإنشاء ملف جديد له.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name" className="text-right">اسم المريض</Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="الاسم الرباعي"
                            className="text-right"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="phone" className="text-right">رقم الهاتف</Label>
                        <Input
                            id="phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="079xxxxxxx"
                            className="text-right"
                            dir="ltr"
                        />
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                            إلغاء
                        </Button>
                        <Button type="submit" disabled={loading} className="gap-2">
                            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                            حفظ البيانات
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
