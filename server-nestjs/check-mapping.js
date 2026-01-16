const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('--- Checking User-WhatsApp Mapping ---');

    // 1. Check all settings to see clinic names
    const clinicNames = await prisma.setting.findMany({
        where: { key: 'clinic_name' }
    });

    console.log('\nClinic Names per User:');
    clinicNames.forEach(s => console.log(`User ${s.userId}: ${s.value}`));

    // 2. Check if there are active chats and their latest activity
    const recentChats = await prisma.whatsAppChat.findMany({
        orderBy: { lastMessageTime: 'desc' },
        take: 10
    });

    console.log('\nRecent WhatsApp Activity:');
    recentChats.forEach(chat => {
        console.log(`User ${chat.userId} | Phone: ${chat.phone} | Last: ${chat.lastMessage?.substring(0, 30)}...`);
    });
}

main().catch(console.error).finally(() => prisma.$disconnect());
