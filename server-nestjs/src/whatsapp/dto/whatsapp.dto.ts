import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class WhatsAppSendMessageDto {
    @ApiProperty({ description: 'رقم الهاتف المستلم', example: '962791234567' })
    phone: string;

    @ApiProperty({ description: 'محتوى الرسالة النصية', example: 'مرحباً بك في عيادة الحكيم' })
    message: string;

    @ApiPropertyOptional({ description: 'رابط الوسائط (صورة، PDF...)', example: 'https://example.com/file.pdf' })
    mediaUrl?: string;

    @ApiPropertyOptional({ description: 'نوع الوسائط', example: 'document', enum: ['image', 'video', 'audio', 'document'] })
    mediaType?: string;
}

export class WhatsAppSettingsDto {
    @ApiPropertyOptional({ description: 'تفعيل الرد التلقائي بالذكاء الاصطناعي', example: true })
    aiEnabled?: boolean;

    @ApiPropertyOptional({ description: 'تفعيل الردود التلقائية العامة', example: true })
    autoReplyEnabled?: boolean;

    @ApiPropertyOptional({ description: 'ساعات العمل بالذكاء الاصطناعي', example: '9AM-5PM' })
    workingHours?: string;
}

export class CreateTemplateDto {
    @ApiProperty({ description: 'كلمة الزناد (Trigger)', example: 'مواعيد' })
    trigger: string;

    @ApiProperty({ description: 'الرد المبرمج', example: 'أهلاً بك، لحجز موعد يرجى الدخول للرابط التالي...' })
    response: string;

    @ApiPropertyOptional({ description: 'تفعيل القالب', example: true })
    isActive?: boolean;
}

export class WhatsAppStatusResponseDto {
    @ApiProperty({ example: true, description: 'حالة الاتصال بالواتساب' })
    connected: boolean;

    @ApiPropertyOptional({ example: 'data:image/png;base64...', description: 'رمز QR للربط' })
    qr?: string;

    @ApiPropertyOptional({ example: '962791234567', description: 'رقم الهاتف المرتبط حالياً' })
    phone?: string;
}
