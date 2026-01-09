import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const userId = 6; // User ID from seed-user.ts
    const apiKey = 'AIzaSyCPyrQRyVVJNf23GeNMyZ8u9dpFY-TZyto';

    console.log('Setting AI configuration for user', userId);

    // Upsert AI settings for the user
    await prisma.setting.upsert({
        where: { userId_key: { userId, key: 'ai_enabled' } },
        update: { value: '1' },
        create: { userId, key: 'ai_enabled', value: '1' },
    });

    await prisma.setting.upsert({
        where: { userId_key: { userId, key: 'ai_api_key' } },
        update: { value: apiKey },
        create: { userId, key: 'ai_api_key', value: apiKey },
    });

    await prisma.setting.upsert({
        where: { userId_key: { userId, key: 'ai_system_instruction' } },
        update: { value: 'أنت مساعد ذكي لعيادة طبية. ساعد المرضى في حجز المواعيد والإجابة على استفساراتهم بلطف واحترافية.' },
        create: { userId, key: 'ai_system_instruction', value: 'أنت مساعد ذكي لعيادة طبية. ساعد المرضى في حجز المواعيد والإجابة على استفساراتهم بلطف واحترافية.' },
    });

    console.log('✅ AI settings configured successfully!');
    console.log('🤖 AI is now enabled with Gemini API');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
