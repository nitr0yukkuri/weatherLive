// src/app/api/items/obtain/route.ts

import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';

export async function POST(request: Request) {
    try {
        const { weather } = await request.json();

        if (!weather) {
            return NextResponse.json({ message: '天候情報が必要です。' }, { status: 400 });
        }

        // 1. 全てのアイテムを取得する
        const allItems = await prisma.item.findMany();

        if (allItems.length === 0) {
            return NextResponse.json({ message: 'アイテムが見つかりません。' }, { status: 404 });
        }

        // ★★★ ここからが新しい抽選ロジックです ★★★

        // 2. 各アイテムに「重み」を設定
        const weights = allItems.map(item => {
            // 基本の重み (normal: 10, rare: 3)
            let weight = item.rarity === 'rare' ? 3 : 10;

            // 天候ボーナス！
            // 現在の天候とアイテムの天候が一致すれば、重みを大幅にアップ
            if (item.weather === weather) {
                weight += 20; // この数値を調整すると、出やすさが変わります
            }
            return weight;
        });

        // 3. 重みに基づいて、ランダムにアイテムを1つ選ぶ
        const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
        let randomValue = Math.random() * totalWeight;

        let selectedItem = allItems[allItems.length - 1]; // 念のためデフォルトを設定

        for (let i = 0; i < allItems.length; i++) {
            randomValue -= weights[i];
            if (randomValue < 0) {
                selectedItem = allItems[i];
                break;
            }
        }
        // ★★★ 新しい抽選ロジックはここまで ★★★

        console.log(`APIが取得したアイテム情報 (天気: ${weather}):`, selectedItem);

        return NextResponse.json(selectedItem);

    } catch (error) {
        console.error("Failed to obtain item:", error);
        return NextResponse.json({ message: 'アイテムの獲得に失敗しました。' }, { status: 500 });
    }
}