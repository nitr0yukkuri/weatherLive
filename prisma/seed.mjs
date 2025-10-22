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
    { name: 'かぜぐるま', description: '風の力でくるくる回るおもちゃ。', rarity: 'normal', iconName: 'GiWhirlwind', weather: 'windy' },
    // ▼▼▼ こけしアイテムを「まいごのこけし」に変更 ▼▼▼
    {
        name: 'まいごのこけし', // 名前を変更
        description: 'あれ？こんなところにこけしが…。持ち主を探しているのかな？', // 説明を変更
        rarity: 'rare', // レア度を rare に変更
        iconName: 'IoBodyOutline', // アイコン名はそのまま
        weather: null // どの天気でも見つかる
    },
    // ▲▲▲ 変更ここまで ▲▲▲
];

async function main() {
    console.log('Seeding started...');
    // 既存のアイテムを削除する前に、関連する UserInventory レコードを削除
    await prisma.userInventory.deleteMany(); // ← 外部キー制約エラーを防ぐため
    console.log('Deleted existing user inventories.');
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