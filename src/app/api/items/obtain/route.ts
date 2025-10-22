// src/app/api/items/obtain/route.ts

import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';

// ★★★ レア度ごとの基本の重みを定義 ★★★
const RarityWeight = {
    normal: 100,      // 出やすい
    uncommon: 50,     // やや出にくい
    rare: 25,         // 出にくい
    epic: 10,         // かなり出にくい
    legendary: 1      // めったに出ない
};

export async function POST(request: Request) {
    try {
        const { weather } = await request.json();

        if (!weather) {
            return NextResponse.json({ message: '天候情報が必要です。' }, { status: 400 });
        }

        const allItems = await prisma.item.findMany();

        if (allItems.length === 0) {
            return NextResponse.json({ message: 'アイテムが見つかりません。' }, { status: 404 });
        }

        // --- ▼▼▼ 抽選ロジックを更新 ▼▼▼ ---

        const weights = allItems.map(item => {
            // 1. 基本の重みを取得 (定義外のレア度の場合は normal 扱い)
            let weight = RarityWeight[item.rarity as keyof typeof RarityWeight] ?? RarityWeight.normal;

            // 2. 天候ボーナス！
            if (item.weather === weather) {
                // レア度が高いほどボーナスの倍率を上げる（例）
                if (item.rarity === 'legendary') weight *= 5; // Legendaryは5倍
                else if (item.rarity === 'epic') weight *= 4; // Epicは4倍
                else if (item.rarity === 'rare') weight *= 3; // Rareは3倍
                else weight *= 2; // Normal/Uncommonは2倍
            }
            // 3. 天気が null (いつでも出る) アイテムの重みを少し下げる (天候限定アイテムを優先させるため)
            else if (item.weather === null && weather !== null) {
                weight *= 0.8; // 例えば 80% に
            }


            // 重みが0以下にならないように保証
            return Math.max(weight, 0.1); // 最低でも0.1の確率を持たせる
        });

        const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);

        // totalWeightが0の場合（ありえないはずだが念のため）
        if (totalWeight <= 0) {
            console.error("Total weight is zero or negative. Cannot select item.");
            // フォールバックとして最初のアイテムを返すなど
            return NextResponse.json(allItems[0]);
        }


        let randomValue = Math.random() * totalWeight;
        let selectedItem = allItems[allItems.length - 1]; // デフォルト

        for (let i = 0; i < allItems.length; i++) {
            randomValue -= weights[i];
            if (randomValue < 0) {
                selectedItem = allItems[i];
                break;
            }
        }
        // --- ▲▲▲ 更新ここまで ▲▲▲ ---

        console.log(`Selected item (Weather: ${weather}):`, selectedItem.name, `(Rarity: ${selectedItem.rarity})`);

        return NextResponse.json(selectedItem);

    } catch (error) {
        console.error("Failed to obtain item:", error);
        return NextResponse.json({ message: 'アイテムの獲得に失敗しました。' }, { status: 500 });
    }
}