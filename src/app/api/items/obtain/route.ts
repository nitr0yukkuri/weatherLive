// src/app/api/items/obtain/route.ts

import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma'; // 修正済み

export async function POST(request: Request) {
    try {
        const itemName = 'あじさい';

        const item = await prisma.item.findUnique({
            where: { name: itemName },
        });

        if (!item) {
            return NextResponse.json({ message: '指定されたアイテムが見つかりません。' }, { status: 404 });
        }

        // ★★★ これを追加！ ★★★
        // データベースから取得したデータをターミナルに出力する
        console.log('APIが取得したアイテム情報:', item);

        return NextResponse.json(item);

    } catch (error) {
        console.error("Failed to obtain item:", error);
        return NextResponse.json({ message: 'アイテムの獲得に失敗しました。' }, { status: 500 });
    }
}