// src/app/api/walk/complete/route.ts

import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';

// おさんぽ完了時に進捗を更新するAPI
export async function POST() {
    try {
        // ID 1 のレコードが存在するか確認
        let progress = await prisma.userProgress.findUnique({
            where: { id: 1 },
        });

        // レコードが存在しない場合は作成（walkCountを1で初期化）
        if (!progress) {
            progress = await prisma.userProgress.create({
                data: { id: 1, walkCount: 1 },
            });
        } else {
            // walkCountをインクリメント
            progress = await prisma.userProgress.update({
                where: { id: 1 },
                data: { walkCount: { increment: 1 } },
            });
        }

        return NextResponse.json({ message: 'おさんぽ回数を更新しました。', progress });
    } catch (error) {
        console.error("Failed to update walk count:", error);
        return NextResponse.json({ message: 'おさんぽ回数の更新に失敗しました。' }, { status: 500 });
    }
}