import { Injectable, ConflictException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterPatientDto, LoginPatientDto, UpdatePatientProfileDto } from './patient.dto';

@Injectable()
export class PatientService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) { }

    async register(dto: RegisterPatientDto) {
        // Check if email already exists
        const existingEmail = await this.prisma.patient.findUnique({
            where: { email: dto.email },
        });

        if (existingEmail) {
            throw new ConflictException('البريد الإلكتروني مستخدم بالفعل');
        }

        // Check if phone already exists
        const existingPhone = await this.prisma.patient.findUnique({
            where: { phone: dto.phone },
        });

        if (existingPhone) {
            throw new ConflictException('رقم الهاتف مستخدم بالفعل');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(dto.password, 10);

        // Create patient
        const patient = await this.prisma.patient.create({
            data: {
                email: dto.email,
                password: hashedPassword,
                fullName: dto.fullName,
                phone: dto.phone,
                dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : null,
                gender: dto.gender,
                address: dto.address,
            },
            select: {
                id: true,
                email: true,
                fullName: true,
                phone: true,
                avatar: true,
                dateOfBirth: true,
                gender: true,
                address: true,
                createdAt: true,
            },
        });

        // Generate JWT token
        const token = this.jwtService.sign({
            sub: patient.id,
            email: patient.email,
            type: 'patient',
        });

        return {
            patient,
            token,
        };
    }

    async login(dto: LoginPatientDto) {
        // Find patient by email
        const patient = await this.prisma.patient.findUnique({
            where: { email: dto.email },
        });

        if (!patient) {
            throw new UnauthorizedException('البريد الإلكتروني أو كلمة المرور غير صحيحة');
        }

        // Check if account is active
        if (!patient.isActive) {
            throw new UnauthorizedException('الحساب غير نشط');
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(dto.password, patient.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('البريد الإلكتروني أو كلمة المرور غير صحيحة');
        }

        // Generate JWT token
        const token = this.jwtService.sign({
            sub: patient.id,
            email: patient.email,
            type: 'patient',
        });

        // Return patient data without password
        const { password, ...patientData } = patient;

        return {
            patient: patientData,
            token,
        };
    }

    async getProfile(patientId: number) {
        const patient = await this.prisma.patient.findUnique({
            where: { id: patientId },
            select: {
                id: true,
                email: true,
                fullName: true,
                phone: true,
                avatar: true,
                dateOfBirth: true,
                gender: true,
                bloodType: true,
                allergies: true,
                chronicDiseases: true,
                emergencyContact: true,
                address: true,
                nationalId: true,
                isEmailVerified: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        if (!patient) {
            throw new NotFoundException('المريض غير موجود');
        }

        return patient;
    }

    async updateProfile(patientId: number, dto: UpdatePatientProfileDto) {
        // Check if phone is being updated and already exists
        if (dto.phone) {
            const existingPhone = await this.prisma.patient.findFirst({
                where: {
                    phone: dto.phone,
                    NOT: { id: patientId },
                },
            });

            if (existingPhone) {
                throw new ConflictException('رقم الهاتف مستخدم بالفعل');
            }
        }

        const updatedPatient = await this.prisma.patient.update({
            where: { id: patientId },
            data: {
                ...dto,
                dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined,
            },
            select: {
                id: true,
                email: true,
                fullName: true,
                phone: true,
                avatar: true,
                dateOfBirth: true,
                gender: true,
                bloodType: true,
                allergies: true,
                chronicDiseases: true,
                emergencyContact: true,
                address: true,
                nationalId: true,
                updatedAt: true,
            },
        });

        return updatedPatient;
    }

    async getClinics() {
        const clinics = await this.prisma.user.findMany({
            where: {
                role: 'USER',
                status: 'active',
                clinic_name: {
                    not: null,
                },
            },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                avatar: true,
                clinic_name: true,
                clinic_address: true,
                clinic_phone: true,
                clinic_specialty: true,
                working_hours: true,
            },
            orderBy: {
                clinic_name: 'asc',
            },
        });

        return clinics;
    }

    async getClinicById(clinicId: number) {
        const clinic = await this.prisma.user.findUnique({
            where: { id: clinicId },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                avatar: true,
                clinic_name: true,
                clinic_address: true,
                clinic_phone: true,
                clinic_specialty: true,
                working_hours: true,
            },
        });

        if (!clinic) {
            throw new NotFoundException('العيادة غير موجودة');
        }

        return clinic;
    }
}
