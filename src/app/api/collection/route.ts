import { NextResponse } from 'next/server';
// ★★★ パスを修正しました ('../' を '../..' に) ★★★
import prisma from '../../lib/prisma';

// (これ以降のコードは変更なし)
export async function GET() {
    try {
        const allItems = await prisma.item.findMany({
            orderBy: { id: 'asc' },
        });
        const inventory = await prisma.userInventory.findMany();
        const collection = allItems.map(item => {
            const inventoryItem = inventory.find(inv => inv.itemId === item.id);
            return {
                ...item,
                quantity: inventoryItem ? inventoryItem.quantity : 0,
            };
        });
        return NextResponse.json(collection);
    } catch (error) {
        console.error("Failed to fetch collection:", error);
        return NextResponse.json({ message: 'コレクションの取得に失敗しました。' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const { itemId } = await request.json();
        if (!itemId) {
            return NextResponse.json({ message: 'アイテムIDが必要です。' }, { status: 400 });
        }
        const existingItem = await prisma.userInventory.findUnique({
            where: { itemId: itemId },
        });
        if (existingItem) {
            await prisma.userInventory.update({
                where: { itemId: itemId },
                data: { quantity: { increment: 1 } },
            });
        } else {
            await prisma.userInventory.create({
                data: {
                    itemId: itemId,
                    quantity: 1,
                },
            });
        }
        return NextResponse.json({ message: 'コレクションを更新しました。' });
    } catch (error) {
        console.error("Failed to update collection:", error);
        return NextResponse.json({ message: 'コレクションの更新に失敗しました。' }, { status: 500 });
    }
}