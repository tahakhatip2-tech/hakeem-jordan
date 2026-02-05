const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('--- Searching for Appointment: Muath (معاد الخطيب) ---');

    const appointment = await prisma.appointment.findFirst({
        where: {
            userId: 2,
            customerName: { contains: 'معاد' }
        }
    });

    if (appointment) {
        console.log('✅ Found Appointment!');
        console.log(`ID: ${appointment.id}`);
        console.log(`Patient: ${appointment.customerName}`);
        console.log(`Date: ${appointment.appointmentDate.toISOString()}`);
        console.log(`Status: ${appointment.status}`);
    } else {
        console.log('❌ Appointment NOT found in database.');

        // Check if the AI even sent the hidden tag
        const lastMsgs = await prisma.whatsAppMessage.findMany({
            where: { chat: { userId: 2 } },
            orderBy: { timestamp: 'desc' },
            take: 5
        });

        console.log('\nLast 5 AI Messages for User 2:');
        lastMsgs.forEach(m => {
            console.log(`[${m.timestamp.toISOString()}] ${m.fromMe ? '🤖' : '👤'}: ${m.content}`);
        });
    }
}

main().catch(console.error).finally(() => prisma.$disconnect());
