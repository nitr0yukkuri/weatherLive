// prisma/seed.mjs

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const initialItems = [
    { name: 'ひまわりのタネ', description: '太陽が好きな花のタネ。晴れた日に見つかる。', rarity: 'normal' },
    { name: 'てるてるぼうず', description: '次の日が晴れるようにお願いするお人形。', rarity: 'rare' },
    { name: 'あじさい', description: '雨の日にきれいに咲く花。', rarity: 'normal' },
    { name: 'かたつむりのカラ', description: '雨が好きな生き物のお家。', rarity: 'rare' },
    { name: 'わたぐも', description: '空にうかぶ雲のかけら。くもりの日に手に入る。', rarity: 'normal' },
    { name: '雪の結晶', description: 'キラキラと輝く、冬のたからもの。', rarity: 'normal' },
    { name: 'ほしのかけら', description: '夜空から落ちてきた、小さな光。', rarity: 'rare' },
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