// src/app/api/progress/route.ts

import { NextResponse } from 'next/server';
import prisma from '../../lib/prisma';

// ユーザーの進捗を取得するAPI
export async function GET() {
    try {
        // ユーザーが一人である前提で、ID 1 のレコードを取得
        let progress = await prisma.userProgress.findUnique({
            where: { id: 1 },
        });

        // レコードが存在しない場合は作成（初期化）
        if (!progress) {
            progress = await prisma.userProgress.create({
                data: { id: 1, walkCount: 0 },
            });
        }

        return NextResponse.json(progress);
    } catch (error) {
        console.error("Failed to fetch user progress:", error);
        return NextResponse.json({ message: '進捗情報の取得に失敗しました。' }, { status: 500 });
    }
}