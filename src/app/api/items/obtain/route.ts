// src/app/api/items/obtain/route.ts

import { NextResponse } from 'next/server';
// ↓↓↓ ここでPrismaを直接インポートします ↓↓↓
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const itemName = 'あじさい';

        let item = await prisma.item.findUnique({
            where: { name: itemName },
        });

        if (!item) {
            item = await prisma.item.create({
                data: {
                    name: itemName,
                    description: '雨の日に咲く、きれいな花。',
                    rarity: 'normal',
                },
            });
        }

        return NextResponse.json(item);

    } catch (error) {
        console.error("Failed to obtain item:", error);
        return NextResponse.json({ message: 'アイテムの獲得に失敗しました。' }, { status: 500 });
    }
}