
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('--- Verifying AI Employee Status ---');

    // 1. Find users with AI enabled
    const aiSettings = await prisma.setting.findMany({
        where: { key: 'ai_enabled', value: '1' },
        select: { userId: true }
    });

    const userIds = aiSettings.map(s => s.userId);

    if (userIds.length === 0) {
        console.log('❌ No users have AI enabled (setting "ai_enabled" = "1" not found).');
        return;
    }

    console.log(`✅ Found ${userIds.length} user(s) with AI enabled.`);

    for (const userId of userIds) {
        console.log(`\nChecking User ID: ${userId}...`);

        // Check API Key
        const apiKey = await prisma.setting.findUnique({
            where: { userId_key: { userId, key: 'ai_api_key' } }
        });

        if (!apiKey || !apiKey.value) {
            console.log('   Warning: "ai_api_key" is MISSING or empty.');
        } else {
            console.log('   ✅ API Key: Present');
        }

        // Check Clinic Details
        const clinicName = await prisma.setting.findUnique({ where: { userId_key: { userId, key: 'clinic_name' } } });
        console.log(`   Clinic Name: ${clinicName?.value || 'Not Set'}`);

        // Check Knowledge Base (Templates)
        const templateCount = await prisma.autoReplyTemplate.count({ where: { userId, isActive: true } });
        console.log(`   📚 Active Templates: ${templateCount}`);

        // Check Services
        const serviceCount = await prisma.service.count({ where: { userId, isActive: true } });
        console.log(`   🏥 Active Services: ${serviceCount}`);

        // Check Recent Activity (Last 5 outgoing messages)
        const recentMessages = await prisma.whatsAppMessage.findMany({
            where: {
                chat: { userId },
                fromMe: true
            },
            orderBy: { timestamp: 'desc' },
            take: 5
        });

        if (recentMessages.length > 0) {
            console.log('   📝 Recent AI/System Responses:');
            recentMessages.forEach(msg => {
                const content = msg.content || '(empty message)';
                console.log(`      - [${msg.timestamp.toISOString()}] ${content.substring(0, 50)}...`);
            });
        } else {
            console.log('   ℹ️ No recent outgoing messages found.');
        }
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
