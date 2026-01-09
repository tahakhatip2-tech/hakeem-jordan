
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const apiKey = 'AIzaSyCPyrQRyVVJNf23GeNMyZ8u9dpFY-TZyto';

    console.log('Setting Gemini API Key...');

    // Upsert API Key
    await prisma.setting.upsert({
        where: { userId_key: { userId: 1, key: 'ai_api_key' } },
        update: { value: apiKey },
        create: { userId: 1, key: 'ai_api_key', value: apiKey },
    });

    // Ensure AI is Enables
    await prisma.setting.upsert({
        where: { userId_key: { userId: 1, key: 'ai_enabled' } },
        update: { value: '1' },
        create: { userId: 1, key: 'ai_enabled', value: '1' },
    });

    console.log('Success! Gemini API Key set and AI Enabled.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
