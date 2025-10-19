// src/app/api/items/obtain/route.ts

import { NextResponse } from 'next/server';
// lib/prisma.tsからPrismaClientのインスタンスをインポートします
import prisma from '../../../lib/prisma';

export async function POST(request: Request) {
    try {
        // ここでは一旦、簡単にするために 'あじさい' を取得するロジックのままにします
        const itemName = 'あじさい';

        const item = await prisma.item.findUnique({
            where: { name: itemName },
        });

        // もしアイテムが見つからなかった場合の処理
        if (!item) {
            return NextResponse.json({ message: '指定されたアイテムが見つかりません。' }, { status: 404 });
        }

        // ★★★ 変更点 ★★★
        // 取得したitemオブジェクト（これにはnameとiconNameの両方が含まれます）をそのまま返す
        return NextResponse.json(item);

    } catch (error) {
        console.error("Failed to obtain item:", error);
        return NextResponse.json({ message: 'アイテムの獲得に失敗しました。' }, { status: 500 });
    }
}