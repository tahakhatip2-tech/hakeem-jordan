const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('--- Checking Appointments for User 1 (طـه) ---');
    const userId = 1;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfter = new Date(tomorrow);
    dayAfter.setDate(dayAfter.getDate() + 1);

    const appointments = await prisma.appointment.findMany({
        where: {
            userId,
            appointmentDate: { gte: today, lt: dayAfter }
        },
        include: { contact: true }
    });

    if (appointments.length === 0) {
        console.log('❌ No appointments found for User 1 today/tomorrow.');
    } else {
        appointments.forEach(apt => {
            console.log(`📌 [${apt.appointmentDate.toISOString()}] Patient: ${apt.customerName} | Notes: ${apt.notes}`);
        });
    }
}

main().catch(console.error).finally(() => prisma.$disconnect());
