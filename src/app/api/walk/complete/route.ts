// src/app/api/walk/complete/route.ts

import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';

// ★★★ 修正点: dynamic export を追加 ★★★
export const dynamic = 'force-dynamic';

// おさんぽ完了時に進捗を更新するAPI
export async function POST() {
    try {
        // ... (省略)
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