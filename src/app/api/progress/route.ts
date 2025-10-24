// src/app/api/progress/route.ts
import { NextResponse } from 'next/server';
import prisma from '../../lib/prisma';
// import { getCurrentUser } from '@/app/lib/session'; // ★ 削除

export const dynamic = 'force-dynamic';

export async function GET() {
    // ★ ユーザー取得処理を削除

    try {
        // ★ where, create から userId を削除し、id: 1 を使うように戻す
        const progress = await prisma.userProgress.upsert({
            where: { id: 1 },
            update: {},
            create: { id: 1, walkCount: 0 },
        });

        return NextResponse.json(progress);
    } catch (error) {
        console.error("Failed to fetch user progress:", error);
        // ★ ログイン不要なので、デフォルト値を返す処理は削除
        return NextResponse.json({ message: '進捗情報の取得に失敗しました。' }, { status: 500 });
    }
}