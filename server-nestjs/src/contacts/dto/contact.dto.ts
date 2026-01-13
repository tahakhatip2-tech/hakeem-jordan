import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateContactDto {
    @ApiProperty({ description: 'اسم المريض/جهة الاتصال', example: 'محمد أحمد' })
    name: string;

    @ApiProperty({ description: 'رقم الهاتف', example: '+962791234567' })
    phone: string;

    @ApiPropertyOptional({ description: 'الرقم الوطني', example: '9901020304' })
    nationalId?: string;

    @ApiPropertyOptional({ description: 'البريد الإلكتروني', example: 'patient@example.com' })
    email?: string;

    @ApiPropertyOptional({ description: 'العنوان/الموقع', example: 'عمان، الأردن' })
    location?: string;

    @ApiPropertyOptional({ description: 'فصيلة الدم', example: 'A+' })
    bloodType?: string;

    @ApiPropertyOptional({ description: 'الحساسية', example: 'حساسية من البنسلين' })
    allergies?: string;

    @ApiPropertyOptional({ description: 'الأمراض المزمنة', example: 'السكري' })
    chronicDiseases?: string;

    @ApiPropertyOptional({ description: 'ملاحظات طبية عامة', example: 'يحتاج لمتابعة دورية' })
    medicalNotes?: string;
}

export class UpdateContactStatusDto {
    @ApiProperty({ description: 'الحالة الجديدة', example: 'active', enum: ['active', 'inactive', 'blocked'] })
    status: string;
}

export class ContactResponseDto {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: 'محمد أحمد' })
    name: string;

    @ApiProperty({ example: '+962791234567' })
    phone: string;

    @ApiProperty({ example: 'active' })
    status: string;

    @ApiPropertyOptional({ example: '9901020304' })
    nationalId?: string;

    @ApiProperty({ example: 5, description: 'إجمالي عدد المواعيد' })
    total_appointments: number;

    @ApiPropertyOptional({ example: '2026-01-10T10:00:00.000Z', description: 'تاريخ آخر زيارة' })
    last_visit: Date;

    @ApiProperty({ example: 'active', description: 'حالة المريض' })
    patient_status: string;
}
