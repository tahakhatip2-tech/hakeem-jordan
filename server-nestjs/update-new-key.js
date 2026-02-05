const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const NEW_API_KEY = 'AIzaSyAEgF0YkNhrSUwIj-HgBq2HCsqHLN8ZiQA';

async function main() {
    console.log('--- Updating AI API Key (New Key) ---');

    const users = await prisma.user.findMany({ select: { id: true, email: true } });

    console.log(`Found ${users.length} users in the system.`);

    for (const user of users) {
        console.log(`Updating key for User ID: ${user.id} (${user.email})...`);

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

    console.log('\n🎉 All users updated with new API key!');
    console.log('The AI employee should now work correctly.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
