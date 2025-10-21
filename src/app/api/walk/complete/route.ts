// src/app/api/walk/complete/route.ts

import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';

// おさんぽ完了時に進捗を更新するAPI
export async function POST() {
    try {
        // ★★★ 修正箇所: upsertを使用してレースコンディションを回避 ★★★
        // レコードが存在すれば walkCount をインクリメントし、存在しなければ walkCount: 1 で作成
        const progress = await prisma.userProgress.upsert({
            where: { id: 1 },
            update: {
                walkCount: { increment: 1 }, // 存在する場合、インクリメント
            },
            create: {
                id: 1,
                walkCount: 1, // 存在しない場合、1で作成
            },
        });
        // ★★★ 修正終わり ★★★

        return NextResponse.json({ message: 'おさんぽ回数を更新しました。', progress });
    } catch (error) {
        console.error("Failed to update walk count:", error);
        // エラーの原因がデータベース競合でなくなったため、より具体的なエラーメッセージを返すことも検討できますが、
        // ここでは500エラーを返します。
        return NextResponse.json({ message: 'おさんぽ回数の更新に失敗しました。' }, { status: 500 });
    }
}