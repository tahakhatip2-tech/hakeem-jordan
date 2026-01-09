import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkApiResponse() {
    console.log('Simulating /api/appointments response...');
    const appointments = await prisma.appointment.findMany({
        where: { userId: 6 },
        include: { contact: true },
        orderBy: { appointmentDate: 'asc' }
    });

    console.log(JSON.stringify(appointments, null, 2));
}

checkApiResponse()
    .finally(async () => {
        await prisma.$disconnect();
    });
