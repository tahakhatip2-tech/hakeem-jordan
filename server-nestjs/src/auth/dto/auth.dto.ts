import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
    @ApiProperty({
        description: 'البريد الإلكتروني للمستخدم',
        example: 'tahakhatip2@gmail.com',
        required: true,
    })
    email: string;

    @ApiProperty({
        description: 'كلمة المرور',
        example: 'yourpassword123',
        required: true,
        minLength: 6,
    })
    password: string;
}

export class RegisterDto {
    @ApiProperty({
        description: 'البريد الإلكتروني للمستخدم',
        example: 'doctor@clinic.com',
        required: true,
    })
    email: string;

    @ApiProperty({
        description: 'كلمة المرور',
        example: 'securePassword123',
        required: true,
        minLength: 6,
    })
    password: string;

    @ApiProperty({
        description: 'اسم المستخدم',
        example: 'د. أحمد محمد',
        required: false,
    })
    name?: string;
}

export class UpdateProfileDto {
    @ApiProperty({
        description: 'اسم المستخدم',
        example: 'د. أحمد محمد',
        required: false,
    })
    name?: string;

    @ApiProperty({
        description: 'البريد الإلكتروني',
        example: 'doctor@clinic.com',
        required: false,
    })
    email?: string;

    @ApiProperty({
        description: 'رقم الهاتف',
        example: '+962791234567',
        required: false,
    })
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
