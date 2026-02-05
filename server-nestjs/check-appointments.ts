import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkAppointments() {
    console.log('Checking recent appointments...');
    const appointments = await prisma.appointment.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10
    });

    appointments.forEach(apt => {
        console.log(`ID: ${apt.id}, Name: ${apt.customerName}, Date: ${apt.appointmentDate}, Valid: ${!isNaN(apt.appointmentDate.getTime())}`);
    });
}

checkAppointments()
    .finally(async () => {
        await prisma.$disconnect();
    });
