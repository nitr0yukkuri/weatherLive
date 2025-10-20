// src/app/api/items/obtain/route.ts

import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';

export async function POST(request: Request) {
    try {
        const { weather } = await request.json();

        if (!weather) {
            return NextResponse.json({ message: '天候情報が必要です。' }, { status: 400 });
        }

        // 指定された天候に紐づくアイテムを検索
        let items = await prisma.item.findMany({
            where: { weather: weather },
        });

        // もし該当する天候のアイテムがなければ、全アイテムからランダムに選ぶ（フォールバック）
        if (items.length === 0) {
            items = await prisma.item.findMany();
        }

        if (items.length === 0) {
            return NextResponse.json({ message: 'アイテムが見つかりません。' }, { status: 404 });
        }

        // 取得したアイテムの中からランダムに1つ選ぶ
        const randomItem = items[Math.floor(Math.random() * items.length)];

        console.log('APIが取得したアイテム情報:', randomItem);

        return NextResponse.json(randomItem);

    } catch (error) {
        console.error("Failed to obtain item:", error);
        return NextResponse.json({ message: 'アイテムの獲得に失敗しました。' }, { status: 500 });
    }
}