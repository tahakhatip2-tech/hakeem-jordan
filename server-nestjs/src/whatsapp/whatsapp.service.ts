import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import makeWASocket, {
    DisconnectReason,
    useMultiFileAuthState,
    fetchLatestBaileysVersion,
    WAMessage,
    downloadMediaMessage,
} from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from './ai.service';
import * as path from 'path';
import * as fs from 'fs';
import P from 'pino';

import { AppointmentsService } from '../appointments/appointments.service';

@Injectable()
export class WhatsAppService implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(WhatsAppService.name);
    private sockets = new Map<number, any>();
    private qrCodes = new Map<number, string>();
    private connectionStatus = new Map<number, boolean>();
    private sessionPath = path.join(process.cwd(), 'sessions');
    private readonly INDIVIDUAL_JID_SUFFIX = '@s.whatsapp.net';

    private isIndividualJid(jid: string): boolean {
        return jid?.endsWith(this.INDIVIDUAL_JID_SUFFIX) || jid?.endsWith('@lid');
    }

    constructor(
        private prisma: PrismaService,
        private aiService: AiService,
        private appointmentsService: AppointmentsService,
    ) {
        if (!fs.existsSync(this.sessionPath)) {
            fs.mkdirSync(this.sessionPath, { recursive: true });
        }
    }

    // ... (keep existing methods up to extractAndProcessActions)



    async onModuleInit() {
        this.logger.log('Initializing WhatsApp sessions...');
        if (fs.existsSync(this.sessionPath)) {
            const folders = fs.readdirSync(this.sessionPath);
            for (const folder of folders) {
                if (folder.startsWith('user_')) {
                    const userId = parseInt(folder.replace('user_', ''));
                    if (!isNaN(userId)) {
                        this.logger.log(`Resuming session for user ${userId}`);
                        this.startSession(userId).catch(err => {
                            this.logger.error(`Failed to resume session for user ${userId}: ${err.message}`);
                        });
                    }
                }
            }
        }
    }

    async startSession(userId: number) {
        if (this.sockets.has(userId) && this.connectionStatus.get(userId)) {
            return { status: 'already_connected' };
        }

        const userSessionPath = path.join(this.sessionPath, `user_${userId}`);
        const { state, saveCreds } = await useMultiFileAuthState(userSessionPath);
        const { version } = await fetchLatestBaileysVersion();

        const sock = makeWASocket({
            version,
            auth: state,
            printQRInTerminal: false,
            logger: P({ level: 'silent' }),
            browser: ["Al-Khatib SaaS", "Chrome", "1.0.0"],
        });

        this.sockets.set(userId, sock);

        sock.ev.on('connection.update', (update) => {
            const { connection, lastDisconnect, qr } = update;

            if (qr) {
                this.qrCodes.set(userId, qr);
            }

            if (connection === 'close') {
                const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
                this.connectionStatus.set(userId, false);
                if (shouldReconnect) {
                    this.startSession(userId);
                } else {
                    this.qrCodes.delete(userId);
                    this.sockets.delete(userId);
                    fs.rmSync(userSessionPath, { recursive: true, force: true });
                }
            } else if (connection === 'open') {
                this.connectionStatus.set(userId, true);
                this.qrCodes.delete(userId);
                this.logger.log(`WhatsApp connected for user ${userId}`);
            }
        });

        sock.ev.on('creds.update', saveCreds);

        sock.ev.on('messages.upsert', async ({ messages, type }) => {
            console.log(`[WhatsApp Debug] Received 'messages.upsert' event. Type: ${type}, Count: ${messages.length}`);

            for (const msg of messages) {
                console.log(`[WhatsApp Debug] Raw Message:`, JSON.stringify(msg.key));

                if (!msg.key.fromMe && type === 'notify') {
                    console.log(`[WhatsApp Debug] Processing incoming message from ${msg.key.remoteJid}`);
                    await this.handleMessage(userId, msg);
                } else {
                    console.log(`[WhatsApp Debug] Skipped message. fromMe: ${msg.key.fromMe}, type: ${type}`);
                }
            }
        });

        return { status: 'initializing' };
    }

    async getStatus(userId: number) {
        return {
            connected: this.connectionStatus.get(userId) || false,
            qrCode: this.qrCodes.get(userId) || null,
        };
    }

    async logout(userId: number) {
        const sock = this.sockets.get(userId);
        if (sock) {
            await sock.logout();
            this.sockets.delete(userId);
            this.connectionStatus.delete(userId);
            this.qrCodes.delete(userId);
            const userSessionPath = path.join(this.sessionPath, `user_${userId}`);
            if (fs.existsSync(userSessionPath)) {
                fs.rmSync(userSessionPath, { recursive: true, force: true });
            }
        }
    }

    async getSettings(userId: number) {
        const settings = await this.prisma.setting.findMany({
            where: {
                userId,
                key: { in: ['ai_enabled', 'ai_api_key', 'ai_system_instruction'] }
            }
        });
        return {
            ai_enabled: settings.find(s => s.key === 'ai_enabled')?.value || '1',
            ai_api_key: settings.find(s => s.key === 'ai_api_key')?.value || '',
            ai_system_instruction: settings.find(s => s.key === 'ai_system_instruction')?.value || '',
        };
    }

    async updateSettings(userId: number, data: any) {
        if (data.ai_enabled !== undefined) {
            await this.prisma.setting.upsert({
                where: { userId_key: { userId, key: 'ai_enabled' } },
                update: { value: data.ai_enabled.toString() },
                create: { userId, key: 'ai_enabled', value: data.ai_enabled.toString() },
            });
        }
        if (data.ai_api_key !== undefined) {
            await this.prisma.setting.upsert({
                where: { userId_key: { userId, key: 'ai_api_key' } },
                update: { value: data.ai_api_key },
                create: { userId, key: 'ai_api_key', value: data.ai_api_key },
            });
        }
        if (data.ai_system_instruction !== undefined) {
            await this.prisma.setting.upsert({
                where: { userId_key: { userId, key: 'ai_system_instruction' } },
                update: { value: data.ai_system_instruction },
                create: { userId, key: 'ai_system_instruction', value: data.ai_system_instruction },
            });
        }
        return { success: true };
    }

    async getChats(userId: number) {
        return this.prisma.whatsAppChat.findMany({
            where: { userId, status: 'active' },
            orderBy: { lastMessageTime: 'desc' },
        });
    }

    async getMessages(chatId: number, userId: number) {
        // Verify chat ownership
        const chat = await this.prisma.whatsAppChat.findFirst({
            where: { id: chatId, userId },
        });

        if (!chat) {
            throw new Error('Chat not found or access denied');
        }

        return this.prisma.whatsAppMessage.findMany({
            where: { chatId },
            orderBy: { timestamp: 'asc' },
        });
    }

    async sendMessage(userId: number, data: { phone: string; message: string; mediaUrl?: string; mediaType?: string }) {
        const sock = this.sockets.get(userId);
        if (!sock) throw new Error('WhatsApp not connected');

        const { phone, message, mediaUrl, mediaType } = data;
        if (!this.isIndividualJid(phone)) {
            this.logger.warn(`Skipping sendMessage for non-individual JID: ${phone}`);
            return null;
        }
        let sentMsg;

        if (mediaUrl) {
            // Basic media sending (expanded from legacy sendMessage)
            const mediaOptions: any = {};
            if (mediaType === 'image') mediaOptions.image = { url: mediaUrl };
            else if (mediaType === 'video') mediaOptions.video = { url: mediaUrl };
            else if (mediaType === 'document') mediaOptions.document = { url: mediaUrl };

            sentMsg = await sock.sendMessage(phone, { ...mediaOptions, caption: message });
        } else {
            sentMsg = await sock.sendMessage(phone, { text: message });
        }

        // Save to DB
        const chat = await this.prisma.whatsAppChat.upsert({
            where: { userId_phone: { userId, phone } },
            update: {
                lastMessage: message,
                lastMessageTime: new Date().toISOString(),
            },
            create: {
                userId,
                phone,
                name: phone,
                lastMessage: message,
                lastMessageTime: new Date().toISOString(),
                status: 'active',
            },
        });

        await this.prisma.whatsAppMessage.create({
            data: {
                chatId: chat.id,
                messageId: sentMsg?.key?.id,
                fromMe: true,
                content: message,
                timestamp: new Date(),
                status: 'sent',
            },
        });

        return sentMsg;
    }

    async markRead(chatId: number, userId: number) {
        // Verify ownership
        const chat = await this.prisma.whatsAppChat.findFirst({
            where: { id: chatId, userId },
        });

        if (!chat) {
            throw new Error('Chat not found or access denied');
        }

        await this.prisma.whatsAppChat.update({
            where: { id: chatId },
            data: { unreadCount: 0 },
        });
        return { success: true };
    }

    // Templates
    async getTemplates(userId: number) {
        return this.prisma.autoReplyTemplate.findMany({
            where: { userId },
            orderBy: { priority: 'asc' },
        });
    }

    async createTemplate(userId: number, data: any) {
        return this.prisma.autoReplyTemplate.create({
            data: {
                ...data,
                userId,
            }
        });
    }

    async updateTemplate(id: number, userId: number, data: any) {
        // Verify ownership
        const template = await this.prisma.autoReplyTemplate.findFirst({
            where: { id, userId },
        });

        if (!template) {
            throw new Error('Template not found or access denied');
        }

        return this.prisma.autoReplyTemplate.update({
            where: { id },
            data,
        });
    }

    async deleteTemplate(id: number, userId: number) {
        // Verify ownership
        const template = await this.prisma.autoReplyTemplate.findFirst({
            where: { id, userId },
        });

        if (!template) {
            throw new Error('Template not found or access denied');
        }

        return this.prisma.autoReplyTemplate.delete({ where: { id } });
    }

    async getAnalytics(userId: number) {
        // This is a bit complex as logs might not have userId directly if they are just logs
        // But we can filter logs by templates owned by user? 
        // Or we should add userId to logs. 
        // For now, let's return limited analytics or assume logs are global/not significant yet.
        // Better: We should probably add userId to WhatsAppLog or link via template.
        // Let's assume for now we only count messages for chats owned by user.

        // Count auto-replies triggered by this user's templates
        const autoReplies = await this.prisma.whatsAppLog.count({
            where: {
                template: {
                    userId
                }
            }
        });

        const incoming = await this.prisma.whatsAppMessage.count({
            where: {
                chat: { userId },
                fromMe: false
            }
        });

        const outgoing = await this.prisma.whatsAppMessage.count({
            where: {
                chat: { userId },
                fromMe: true
            }
        });

        const topTriggers = await this.prisma.$queryRaw`
            SELECT t.trigger, CAST(COUNT(l.id) AS TEXT) as count
            FROM "AutoReplyTemplate" t
            JOIN "WhatsAppLog" l ON t.id = l."triggerId"
            WHERE t."userId" = ${userId}
            GROUP BY t.id, t.trigger
            ORDER BY count DESC
            LIMIT 5
        `;

        return { stats: { auto_replies: autoReplies, incoming_messages: incoming, outgoing_messages: outgoing }, topTriggers };
    }

    // Tags
    async getTags(userId: number) {
        return this.prisma.customerTag.findMany({ where: { userId } });
    }

    async getContactTags(phone: string, userId: number) {
        const contact = await this.prisma.contact.findFirst({
            where: { phone, userId },
            include: { tags: true },
        });
        return contact?.tags || [];
    }

    async addContactTag(phone: string, tagId: number, userId: number) {
        // Find contact or create one
        let contact = await this.prisma.contact.findFirst({ where: { phone, userId } });
        if (!contact) {
            // Create contact if not exists for this user?
            // Or fail. Let's create for now as tagging implies interest.
            contact = await this.prisma.contact.create({
                data: {
                    userId,
                    phone,
                    name: phone, // Default name
                    status: 'active',
                    platform: 'whatsapp'
                }
            });
        }

        // Verify tag ownership
        const tag = await this.prisma.customerTag.findFirst({ where: { id: tagId, userId } });
        if (!tag) return { error: 'Tag not found' };

        await this.prisma.contact.update({
            where: { id: contact.id },
            data: {
                tags: { connect: { id: tagId } },
            },
        });
        return { success: true };
    }

    async removeContactTag(phone: string, tagId: number, userId: number) {
        const contact = await this.prisma.contact.findFirst({ where: { phone, userId } });
        if (!contact) return { error: 'Contact not found' };

        await this.prisma.contact.update({
            where: { id: contact.id },
            data: {
                tags: { disconnect: { id: tagId } },
            },
        });
        return { success: true };
    }

    private async handleMessage(userId: number, msg: WAMessage) {
        const sock = this.sockets.get(userId);
        if (!sock) return;

        let from = msg.key.remoteJid;
        // Check for LID and use alternate JID (phone number) if available to avoid duplicates
        const keyAny = msg.key as any;
        if (from?.endsWith('@lid') && keyAny.remoteJidAlt) {
            this.logger.log(`[WhatsApp] Normalizing LID ${from} to ${keyAny.remoteJidAlt}`);
            from = keyAny.remoteJidAlt;
        }

        if (!from || !this.isIndividualJid(from)) return;

        const messageContent = msg.message?.conversation || msg.message?.extendedTextMessage?.text || '';
        if (!messageContent) return;

        this.logger.log(`Message from ${from} for user ${userId}: ${messageContent}`);

        // 1. Save or Update Chat
        let chat = await this.prisma.whatsAppChat.findUnique({
            where: { userId_phone: { userId, phone: from } }
        });

        if (!chat) {
            chat = await this.prisma.whatsAppChat.create({
                data: {
                    userId,
                    phone: from,
                    name: msg.pushName || 'New Contact',
                    lastMessage: messageContent,
                    lastMessageTime: new Date().toISOString(),
                    unreadCount: 1,
                    status: 'active'
                },
            });
        } else {
            chat = await this.prisma.whatsAppChat.update({
                where: { id: chat.id },
                data: {
                    lastMessage: messageContent,
                    lastMessageTime: new Date().toISOString(),
                    unreadCount: { increment: 1 },
                },
            });
        }

        // 2. Save Message
        await this.prisma.whatsAppMessage.create({
            data: {
                chatId: chat.id,
                messageId: msg.key.id,
                fromMe: false,
                content: messageContent,
                timestamp: new Date(),
                status: 'received',
            },
        });

        // 3. AI Reply (Conditional on settings)
        const settings = await this.getSettings(userId);
        if (settings.ai_enabled === '1') {
            const contactName = chat.name || msg.pushName || 'Client';
            const aiResponseRaw = await this.aiService.getAIResponse(userId, messageContent, from, contactName);
            if (aiResponseRaw) {
                // Process Actions (like Appointments)
                const aiResponse = await this.extractAndProcessActions(userId, aiResponseRaw, from);

                await sock.sendMessage(from, { text: aiResponse });

                // Save outgoing message
                await this.prisma.whatsAppMessage.create({
                    data: {
                        chatId: chat.id,
                        fromMe: true,
                        content: aiResponse,
                        timestamp: new Date(),
                        status: 'sent',
                    },
                });
            }
        }
    }

    private async extractAndProcessActions(userId: number, text: string, phone: string): Promise<string> {
        let processedText = text;

        // 1. Appointment Extraction: [[APPOINTMENT: YYYY-MM-DD | HH:MM | Name | Notes]]
        const appointmentRegex = /\[\[APPOINTMENT:\s*([^|]*)?\|\s*([^|]*)?\|\s*([^|]*)?\|\s*([^\]]*)?\]\]/g;
        let match;

        while ((match = appointmentRegex.exec(text)) !== null) {
            const [fullMatch, dateStr, timeStr, name, notes] = match;

            try {
                const date = dateStr?.trim();
                const time = timeStr?.trim();
                const customerName = name?.trim() || 'Unspecified';
                const appointmentNotes = notes?.trim() || 'AI Generated Appointment';

                if (date && time) {
                    const appointmentDate = new Date(`${date}T${time}:00`);
                    if (!isNaN(appointmentDate.getTime())) {
                        this.logger.log(`[AI Action] Creating appointment for ${customerName} on ${appointmentDate}`);

                        // SAFETY CHECK: Verify availability before booking
                        const isAvailable = await this.appointmentsService.isSlotAvailable(userId, appointmentDate, 30); // Assume 30 min default
                        if (!isAvailable) {
                            this.logger.warn(`[AI Action] Slot ${appointmentDate} is busy or invalid. Blocking booking.`);
                            processedText = processedText.replace(fullMatch, "عذراً، يبدو أن هذا الموعد ( " + time + " ) قد تم حجزه للتو أو غير متاح. هل يمكنك اختيار وقت آخر من الأوقات المقترحة؟");
                            continue;
                        }

                        const contact = await this.prisma.contact.upsert({
                            where: { userId_phone: { userId, phone } },
                            update: { status: 'active' },
                            create: {
                                userId,
                                phone,
                                name: customerName,
                                platform: 'whatsapp',
                                status: 'active'
                            }
                        });

                        await this.prisma.appointment.create({
                            data: {
                                userId,
                                patientId: contact.id,
                                phone,
                                customerName,
                                appointmentDate,
                                notes: appointmentNotes,
                                status: 'confirmed'
                            }
                        });

                        // Append success message override if needed
                    }
                }
            } catch (err) {
                this.logger.error(`Failed to process appointment tag: ${err.message}`);
                // fullMatch is safe here because we are still inside the while loop
                processedText = processedText.replace(fullMatch, "حدث خطأ أثناء حجز الموعد: " + err.message);
            }

            // Replace the tag after processing
            if (processedText.includes(fullMatch)) {
                processedText = processedText.replace(fullMatch, '');
            }
        } // End of while loop

        return processedText.trim();
    }

    onModuleDestroy() {
        for (const [userId, sock] of this.sockets) {
            sock.end();
        }
    }
}
