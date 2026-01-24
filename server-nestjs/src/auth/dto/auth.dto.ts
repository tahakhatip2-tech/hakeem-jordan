import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional, Matches } from 'class-validator';

export class LoginDto {
    @ApiProperty({
        description: 'البريد الإلكتروني للمستخدم',
        example: 'tahakhatip2@gmail.com',
        required: true,
    })
    @IsEmail({}, { message: 'البريد الإلكتروني غير صحيح' })
    @IsNotEmpty({ message: 'البريد الإلكتروني مطلوب' })
    email: string;

    @ApiProperty({
        description: 'كلمة المرور',
        example: 'yourpassword123',
        required: true,
        minLength: 6,
    })
    @IsString({ message: 'كلمة المرور يجب أن تكون نصاً' })
    @IsNotEmpty({ message: 'كلمة المرور مطلوبة' })
    @MinLength(6, { message: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' })
    password: string;
}

export class RegisterDto {
    @ApiProperty({
        description: 'البريد الإلكتروني للمستخدم',
        example: 'doctor@clinic.com',
        required: true,
    })
    @IsEmail({}, { message: 'البريد الإلكتروني غير صحيح' })
    @IsNotEmpty({ message: 'البريد الإلكتروني مطلوب' })
    email: string;

    @ApiProperty({
        description: 'كلمة المرور',
        example: 'securePassword123',
        required: true,
        minLength: 6,
    })
    @IsString({ message: 'كلمة المرور يجب أن تكون نصاً' })
    @IsNotEmpty({ message: 'كلمة المرور مطلوبة' })
    @MinLength(6, { message: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' })
    password: string;

    @ApiProperty({
        description: 'رقم الهاتف',
        example: '+962791234567',
        required: true,
    })
    @IsString({ message: 'رقم الهاتف يجب أن يكون نصاً' })
    @IsNotEmpty({ message: 'رقم الهاتف مطلوب' })
    @Matches(/^(\+962|00962|962|0)?7[789]\d{7}$/, {
        message: 'رقم الهاتف يجب أن يكون رقم أردني صحيح (مثال: 0791234567 أو +962791234567)',
    })
    phone: string;

    @ApiProperty({
        description: 'اسم المستخدم',
        example: 'د. أحمد محمد',
        required: false,
    })
    @IsOptional()
    @IsString({ message: 'الاسم يجب أن يكون نصاً' })
    name?: string;
}

export class UpdateProfileDto {
    @ApiProperty({
        description: 'اسم المستخدم',
        example: 'د. أحمد محمد',
        required: false,
    })
    @IsOptional()
    @IsString({ message: 'الاسم يجب أن يكون نصاً' })
    name?: string;

    @ApiProperty({
        description: 'البريد الإلكتروني',
        example: 'doctor@clinic.com',
        required: false,
    })
    @IsOptional()
    @IsEmail({}, { message: 'البريد الإلكتروني غير صحيح' })
    email?: string;

    @ApiProperty({
        description: 'رقم الهاتف',
        example: '+962791234567',
        required: false,
    })
    @IsOptional()
    @IsString({ message: 'رقم الهاتف يجب أن يكون نصاً' })
    phone?: string;
}

export class AuthResponseDto {
    @ApiProperty({
        description: 'JWT Access Token',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    })
    access_token: string;

    @ApiProperty({
        description: 'معلومات المستخدم',
        type: 'object',
        additionalProperties: true,
    })
    user: {
        id: number;
        email: string;
        name: string;
        role: string;
    };
}
