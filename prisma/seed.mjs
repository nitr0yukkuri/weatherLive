// prisma/seed.mjs

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const initialItems = [
    { name: 'ひまわりのタネ', description: '太陽が好きな花のタネ。晴れた日に見つかる。', rarity: 'normal', iconName: 'IoSunny', weather: 'sunny' },
    { name: 'たいようのいし', description: '持っていると心がポカポカする不思議な石。', rarity: 'rare', iconName: 'BsSunFill', weather: 'clear' },
    { name: 'あじさい', description: '雨の日にきれいに咲く花。', rarity: 'normal', iconName: 'IoRainy', weather: 'rainy' },
    { name: 'かたつむり', description: '雨が好きな、のんびりやさん。', rarity: 'rare', iconName: 'GiSnail', weather: 'rainy' },
    { name: 'かみなりのいし', description: 'バリバリとすごい力を秘めている石。', rarity: 'rare', iconName: 'IoThunderstorm', weather: 'thunderstorm' },
    { name: 'わたぐも', description: '空にうかぶ雲のかけら。くもりの日に手に入る。', rarity: 'normal', iconName: 'IoCloudy', weather: 'cloudy' },
    { name: '雪の結晶', description: 'キラキラと輝く、冬のたからもの。', rarity: 'normal', iconName: 'IoSnow', weather: 'snowy' },
    { name: 'ほしのかけら', description: '夜空から落ちてきた、小さな光。', rarity: 'rare', iconName: 'FaStar', weather: 'night' },
    // ★★★ アイコン名を GiWhirlwind に変更 ★★★
    { name: 'かぜぐるま', description: '風の力でくるくる回るおもちゃ。', rarity: 'normal', iconName: 'GiWhirlwind', weather: 'windy' },
];

async function main() {
    console.log('Seeding started...');
    await prisma.item.deleteMany();
    console.log('Deleted existing items.');
    for (const item of initialItems) {
        await prisma.item.create({ data: item });
    }
    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });