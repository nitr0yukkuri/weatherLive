// src/app/api/progress/route.ts

import { NextResponse } from 'next/server';
import prisma from '../../lib/prisma';

// ★★★ 修正点: dynamic export を追加 ★★★
export const dynamic = 'force-dynamic';

// ユーザーの進捗を取得するAPI
export async function GET() {
    try {
        // ... (省略)
        const progress = await prisma.userProgress.upsert({
            where: { id: 1 },
            update: {},
            create: { id: 1, walkCount: 0 },
        });

        return NextResponse.json(progress);
    } catch (error) {
        console.error("Failed to fetch user progress:", error);
        return NextResponse.json({ message: '進捗情報の取得に失敗しました。' }, { status: 500 });
    }
}