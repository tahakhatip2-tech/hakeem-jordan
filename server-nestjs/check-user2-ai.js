const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    console.log('--- Checking User 2 (عماد) AI Settings ---');

    const userId = 2;

    // Get all settings for user 2
    const settings = await prisma.setting.findMany({
        where: { userId },
        orderBy: { key: 'asc' }
    });

    console.log('\n📋 All Settings:');
    settings.forEach(s => {
        console.log(`   ${s.key}: ${s.value}`);
    });

    // Check specific AI settings
    const aiEnabled = settings.find(s => s.key === 'ai_enabled');
    const aiKey = settings.find(s => s.key === 'ai_api_key');

    console.log('\n🤖 AI Configuration:');
    console.log(`   AI Enabled: ${aiEnabled ? aiEnabled.value : 'NOT SET'}`);
    console.log(`   API Key: ${aiKey ? (aiKey.value.substring(0, 10) + '...') : 'NOT SET'}`);

    // Check recent messages
    const recentChats = await prisma.whatsAppChat.findMany({
        where: { userId },
        orderBy: { lastMessageTime: 'desc' },
        take: 5
    });

    console.log('\n💬 Recent Chats:');
    recentChats.forEach(chat => {
        console.log(`   ${chat.name} (${chat.phone}): ${chat.lastMessage?.substring(0, 50)}...`);
        console.log(`      Last: ${chat.lastMessageTime}`);
    });

    // Check WhatsApp connection status
    console.log('\n📱 WhatsApp Status:');
    console.log('   Note: Check the main terminal for WhatsApp connection logs');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
