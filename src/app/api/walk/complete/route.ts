// src/app/api/walk/complete/route.ts
import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';
// ★ 1. @prisma/client から UserProgress 型をインポート
import type { UserProgress } from '@prisma/client';

export const dynamic = 'force-dynamic';

// ★ Helper function to check if two dates are consecutive days
const isConsecutiveDay = (lastWalk: Date, now: Date) => {
    const last = new Date(lastWalk.getFullYear(), lastWalk.getMonth(), lastWalk.getDate());
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const diffTime = today.getTime() - last.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    return diffDays === 1;
};

// ★ Helper function to check if it's the same day
const isSameDay = (lastWalk: Date, now: Date) => {
    return lastWalk.getFullYear() === now.getFullYear() &&
        lastWalk.getMonth() === now.getMonth() &&
        lastWalk.getDate() === now.getDate();
};

export async function POST(request: Request) { // ★ request を受け取る
    // ★ ユーザー取得処理を削除

    // ★ 天気情報を受け取る
    let weather: string;
    try {
        const body = await request.json();
        weather = body.weather || 'sunny'; // bodyがない場合は 'sunny' にフォールバック
    } catch (error) {
        weather = 'sunny'; // JSONパース失敗時も 'sunny' にフォールバック
    }

    try {
        // ★ id: 1 で固定
        // ★ 2. currentProgress に UserProgress 型を明示
        const currentProgress: UserProgress | null = await prisma.userProgress.findUnique({
            where: { id: 1 },
        });

        // ★ id: 1 がない場合 (初回) のデフォルト値
        // ★ 3. progressData に UserProgress 型を明示
        const progressData: UserProgress = currentProgress || {
            id: 1,
            walkCount: 0,
            sunnyWalkCount: 0,
            clearWalkCount: 0,
            rainyWalkCount: 0,
            cloudyWalkCount: 0,
            snowyWalkCount: 0,
            thunderstormWalkCount: 0,
            windyWalkCount: 0,
            nightWalkCount: 0,
            collectedItemTypesCount: 0,
            collectedNormalItemTypesCount: 0,
            collectedUncommonItemTypesCount: 0,
            collectedRareItemTypesCount: 0,
            collectedEpicItemTypesCount: 0,
            collectedLegendaryItemTypesCount: 0,
            consecutiveWalkDays: 0,
            lastWalkDate: null,
        };


        // --- ★ 連続日数と天気カウントのロジック ---
        const now = new Date();
        let consecutiveDays = progressData.consecutiveWalkDays;

        if (progressData.lastWalkDate) {
            const lastWalk = new Date(progressData.lastWalkDate);
            if (isSameDay(lastWalk, now)) {
                // ★ 同日のおさんぽはカウントアップしない (アイテムは引けるが実績は進まない)
                // ★ ただし、総おさんぽ回数(walkCount)だけは増やす
                const progress = await prisma.userProgress.update({
                    where: { id: 1 },
                    data: {
                        walkCount: { increment: 1 },
                        // (天気カウントや連続日数は更新しない)
                    },
                });
                return NextResponse.json({ message: 'おさんぽ回数を更新しました（同日）。', progress });
            } else if (isConsecutiveDay(lastWalk, now)) {
                // 連続日
                consecutiveDays += 1;
            } else {
                // 連続が途切れた
                consecutiveDays = 1; // 1にリセット
            }
        } else {
            // 初回のおさんぽ
            consecutiveDays = 1;
        }

        // ★ 天気別のキーを動的に作成
        // ★ 4. 型を UserProgress のキーとして明示
        const weatherKey = `${weather}WalkCount` as keyof UserProgress;

        // ★ 更新データを作成
        const updateData: any = {
            walkCount: { increment: 1 },
            lastWalkDate: now,
            consecutiveWalkDays: consecutiveDays,
        };

        // ★ schema.prisma に存在するキーかどうかを安全にチェック
        if (weatherKey in progressData) {
            updateData[weatherKey] = { increment: 1 };
        } else {
            console.warn(`Invalid weather key: ${weatherKey}`);
        }
        // --- ★ ロジックここまで ---

        // ★ where, create から userId を削除し、id: 1 を使うように戻す
        const progress = await prisma.userProgress.upsert({
            where: { id: 1 },
            update: updateData, // ★ 更新データを適用
            create: {
                id: 1,
                walkCount: 1,
                lastWalkDate: now,
                consecutiveWalkDays: 1,
                // ★ create時も天気カウントを初期化 (安全なキーアクセス)
                ...((weatherKey in progressData) ? { [weatherKey]: 1 } : { sunnyWalkCount: 1 })
            },
        });

        return NextResponse.json({ message: 'おさんぽ回数を更新しました。', progress });
    } catch (error) {
        console.error("Failed to update walk count:", error);
        return NextResponse.json({ message: 'おさんぽ回数の更新に失敗しました。' }, { status: 500 });
    }
}