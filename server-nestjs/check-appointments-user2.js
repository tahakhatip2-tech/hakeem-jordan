const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    console.log('--- Checking Appointments for User 2 (عماد) ---');

    const userId = 2;

    // Get today's and tomorrow's appointments
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const dayAfter = new Date(tomorrow);
    dayAfter.setDate(dayAfter.getDate() + 1);

    const appointments = await prisma.appointment.findMany({
        where: {
            userId,
            appointmentDate: {
                gte: today,
                lt: dayAfter
            }
        },
        orderBy: { appointmentDate: 'asc' },
        include: {
            contact: true
        }
    });

    console.log(`\n📅 Found ${appointments.length} appointments for today and tomorrow:\n`);

    if (appointments.length === 0) {
        console.log('   ❌ NO APPOINTMENTS FOUND!');
        console.log('   The AI said it booked, but nothing was saved to database.');
    } else {
        appointments.forEach(apt => {
            const date = new Date(apt.appointmentDate);
            console.log(`   📌 Appointment ID: ${apt.id}`);
            console.log(`      Patient: ${apt.customerName}`);
            console.log(`      Phone: ${apt.phone}`);
            console.log(`      Date: ${date.toLocaleString('ar-JO')}`);
            console.log(`      Status: ${apt.status}`);
            console.log('');
        });
    }

    // Check recent WhatsApp messages
    const recentMessages = await prisma.whatsAppMessage.findMany({
        where: {
            chat: { userId }
        },
        orderBy: { timestamp: 'desc' },
        take: 10,
        include: {
            chat: true
        }
    });

    console.log('\n💬 Last 10 WhatsApp Messages:');
    recentMessages.forEach(msg => {
        console.log(`   ${msg.fromMe ? '🤖 Bot' : '👤 User'}: ${msg.content.substring(0, 80)}...`);
        console.log(`      Time: ${msg.timestamp.toLocaleString('ar-JO')}`);
    });
}

main()
    .catch((e) => {
        console.error('Error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
