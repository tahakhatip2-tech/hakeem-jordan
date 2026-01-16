const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('--- Checking Bot Response to "جمعة" (Phone: 962781190415) ---');

    const userId = 1;
    const phone = '962781190415@s.whatsapp.net';

    const messages = await prisma.whatsAppMessage.findMany({
        where: {
            chat: { userId, phone },
            fromMe: true
        },
        orderBy: { timestamp: 'desc' },
        take: 5
    });

    messages.forEach(msg => {
        console.log(`\nTime: ${msg.timestamp.toISOString()}`);
        console.log(`Content: "${msg.content}"`);
    });
}

main().catch(console.error).finally(() => prisma.$disconnect());
