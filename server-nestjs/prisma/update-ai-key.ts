import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const userId = 6;
    const apiKey = 'AIzaSyBTxBDawoUqZvzSRRplT2hZNCCL9bDJru0';

    console.log('Updating AI API Key for user', userId);

    await prisma.setting.upsert({
        where: { userId_key: { userId, key: 'ai_api_key' } },
        update: { value: apiKey },
        create: { userId, key: 'ai_api_key', value: apiKey },
    });

    console.log('✅ AI API Key updated successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
