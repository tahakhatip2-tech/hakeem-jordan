import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User, SubscriptionStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async create(data: Prisma.UserCreateInput): Promise<User> {
        const existingUser = await this.prisma.user.findUnique({
            where: { email: data.email },
        });

        if (existingUser) {
            throw new ConflictException('البريد الإلكتروني مستخدم من قبل');
        }

        // Check if phone already exists
        if (data.phone) {
            const existingPhone = await this.prisma.user.findUnique({
                where: { phone: data.phone },
            });

            if (existingPhone) {
                throw new ConflictException('رقم الهاتف مستخدم من قبل');
            }
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);

        // Calculate trial expiry (7 days from now)
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 7);

        return this.prisma.user.create({
            data: {
                ...data,
                password: hashedPassword,
                subscriptionStatus: SubscriptionStatus.TRIAL,
                expiryDate: expiryDate,
                // We'll set the planId to 1 (assuming 1 is the default Free/Trial plan) 
                // In a real app, we'd fetch the default plan by name
            },
        });
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: { email },
            include: { plan: true }
        });
    }

    async findById(id: number): Promise<User | null> {
        const user = await this.prisma.user.findUnique({
            where: { id },
            include: { plan: true }
        });

        // Auto-expire check
        if (user && user.expiryDate && new Date() > user.expiryDate && user.subscriptionStatus !== SubscriptionStatus.CANCELED) {
            // ... logic ...
        }

        return user;
    }

    async findAll(): Promise<User[]> {
        return this.prisma.user.findMany({
            include: { plan: true },
        });
    }

    async findByPhone(phone: string): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: { phone },
        });
    }

    async update(id: number, data: any): Promise<User> {
        const updateData = { ...data };

        // Check if phone is being updated and if it's already taken by another user
        if (updateData.phone) {
            const existingUser = await this.prisma.user.findUnique({
                where: { phone: updateData.phone },
            });

            if (existingUser && existingUser.id !== id) {
                throw new ConflictException('رقم الهاتف مستخدم من قبل');
            }
        }

        if (updateData.password) {
            updateData.password = await bcrypt.hash(updateData.password, 10);
        }

        return this.prisma.user.update({
            where: { id },
            data: updateData,
        });
    }
}
