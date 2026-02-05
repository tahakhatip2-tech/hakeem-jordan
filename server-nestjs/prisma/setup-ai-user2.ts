import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function setupAIForUser2() {
    try {
        const apiKey = 'AIzaSyCntcPQ1JaMbl3aCqMC1ogv2yTc-ipCqIw';
        const userId = 2;

        console.log(`Setting up AI for user ID: ${userId}`);

        // Set AI API Key
        await prisma.setting.upsert({
            where: { userId_key: { userId, key: 'ai_api_key' } },
            update: { value: apiKey },
            create: { userId, key: 'ai_api_key', value: apiKey },
        });
        console.log('✅ AI API Key set successfully');

        // Enable AI
        await prisma.setting.upsert({
            where: { userId_key: { userId, key: 'ai_enabled' } },
            update: { value: '1' },
            create: { userId, key: 'ai_enabled', value: '1' },
        });
        console.log('✅ AI enabled successfully');

        // Set default system instruction
        const defaultInstruction = 'كن مهذباً ومحترفاً. ساعد المرضى بكل ما تستطيع.';
        await prisma.setting.upsert({
            where: { userId_key: { userId, key: 'ai_system_instruction' } },
            update: { value: defaultInstruction },
            create: { userId, key: 'ai_system_instruction', value: defaultInstruction },
        });
        console.log('✅ AI system instruction set successfully');

        console.log('\n🎉 AI Assistant configured successfully for user 2!');

    } catch (error) {
        console.error('Error setting up AI:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

setupAIForUser2();
