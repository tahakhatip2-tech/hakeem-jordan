
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const NEW_API_KEY = 'AIzaSyCqObAeg2JLBzlGJbzCAe75Syqia1HO5T4';

async function main() {
    console.log('--- Updating AI API Key ---');

    // 1. Find all users who have an 'ai_api_key' setting OR 'ai_enabled' setting
    // Actually, let's just update it for ALL users who have ANY settings, or just Upsert for known users.
    // Getting all users seems safest to ensure everyone gets the new key if they decide to use AI.

    const users = await prisma.user.findMany({ select: { id: true, email: true } });

    console.log(`Found ${users.length} users in the system.`);

    for (const user of users) {
        console.log(`Updating key for User ID: ${user.id} (${user.email})...`);

        // Upsert the setting
        await prisma.setting.upsert({
            where: {
                userId_key: {
                    userId: user.id,
                    key: 'ai_api_key'
                }
            },
            update: {
                value: NEW_API_KEY
            },
            create: {
                userId: user.id,
                key: 'ai_api_key',
                value: NEW_API_KEY
            }
        });

        console.log(`   ✅ Key updated successfully.`);
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
