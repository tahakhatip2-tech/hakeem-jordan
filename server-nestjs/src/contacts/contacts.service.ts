import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Contact, Prisma } from '@prisma/client';

@Injectable()
export class ContactsService {
    constructor(private prisma: PrismaService) { }

    async findAll(userId: number): Promise<any[]> {
        const contacts = await this.prisma.contact.findMany({
            where: { userId },
            include: {
                appointment: {
                    orderBy: { appointmentDate: 'desc' },
                    take: 1,
                },
                _count: {
                    select: { appointment: true }
                },
                tags: true,
            },
            orderBy: { createdAt: 'desc' },
        });

        // Map to match frontend expectations
        return contacts
            .map(contact => ({
                ...contact,
                total_appointments: contact._count.appointment,
                last_visit: contact.appointment[0]?.appointmentDate || null,
                patient_status: contact.status // Backend uses 'status', frontend uses 'patient_status'
            }));
    }

    async create(userId: number, data: any): Promise<Contact> {
        return this.prisma.contact.create({
            data: {
                ...data,
                userId,
            },
        });
    }

    async update(id: number, userId: number, data: any): Promise<Contact> {
        return this.prisma.contact.update({
            where: { id, userId },
            data,
        });
    }

    async findOne(id: number, userId: number): Promise<Contact | null> {
        return this.prisma.contact.findFirst({
            where: { id, userId },
            include: {
                appointment: {
                    orderBy: { appointmentDate: 'desc' },
                    include: {
                        medicalRecords: true
                    }
                },
                tags: true,
                medicalRecords: true, // Also include direct medical records if any
            }
        });
    }

    async findByNationalId(userId: number, nationalId: string): Promise<Contact | null> {
        return this.prisma.contact.findFirst({
            where: { userId, nationalId },
            include: {
                appointment: {
                    orderBy: { appointmentDate: 'desc' },
                },
                tags: true,
                medicalRecords: true
            }
        });
    }

    async updateStatus(id: number, userId: number, status: string): Promise<Contact> {
        return this.prisma.contact.update({
            where: { id, userId },
            data: { status },
        });
    }

    async delete(id: number, userId: number): Promise<Contact> {
        return this.prisma.contact.delete({
            where: { id, userId },
        });
    }

    async syncFromWhatsApp(userId: number): Promise<{ synced: number }> {
        const chats = await this.prisma.whatsAppChat.findMany({
            select: { phone: true, name: true },
        });

        let syncCount = 0;
        for (const chat of chats) {
            // Allow all chats (including @lid) to be synced as contacts
            if (!chat.phone) continue;
            try {
                await this.prisma.contact.upsert({
                    where: {
                        userId_phone: {
                            userId,
                            phone: chat.phone,
                        },
                    },
                    update: {}, // Don't update if exists
                    create: {
                        userId,
                        phone: chat.phone,
                        name: chat.name || 'مريض جديد',
                        platform: 'whatsapp',
                        status: 'active',
                    },
                });
                syncCount++;
            } catch (e) {
                // Skip if error (e.g. duplicate in same transaction)
            }
        }

        return { synced: syncCount };
    }
}
