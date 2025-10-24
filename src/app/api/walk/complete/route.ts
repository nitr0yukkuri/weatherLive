// src/app/api/walk/complete/route.ts
import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';
// import { getCurrentUser } from '@/app/lib/session'; // ★ 削除

export const dynamic = 'force-dynamic';

export async function POST() {
    // ★ ユーザー取得処理を削除

    try {
        // ★ where, create から userId を削除し、id: 1 を使うように戻す
        const progress = await prisma.userProgress.upsert({
            where: { id: 1 },
            update: {
                walkCount: { increment: 1 },
            },
            create: {
                id: 1,
                walkCount: 1,
            },
        });

        return NextResponse.json({ message: 'おさんぽ回数を更新しました。', progress });
    } catch (error) {
        console.error("Failed to update walk count:", error);
        return NextResponse.json({ message: 'おさんぽ回数の更新に失敗しました。' }, { status: 500 });
    }
}