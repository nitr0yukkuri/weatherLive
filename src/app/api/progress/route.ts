// src/app/api/progress/route.ts

import { NextResponse } from 'next/server';
import prisma from '../../lib/prisma';

// ユーザーの進捗を取得するAPI
export async function GET() {
    try {
        // ★★★ 修正箇所: findUnique/create の代わりに upsert を使用し、P2002エラーを回避 ★★★
        const progress = await prisma.userProgress.upsert({
            where: { id: 1 },
            update: {}, // 存在する場合、更新は不要なので空のオブジェクト
            create: { id: 1, walkCount: 0 }, // 存在しない場合のみ作成
        });

        return NextResponse.json(progress);
    } catch (error) {
        console.error("Failed to fetch user progress:", error);
        return NextResponse.json({ message: '進捗情報の取得に失敗しました。' }, { status: 500 });
    }
}