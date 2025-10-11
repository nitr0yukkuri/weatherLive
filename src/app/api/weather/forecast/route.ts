import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');

    const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;

    if (!apiKey) {
        return NextResponse.json({ error: 'APIキーが設定されていません。' }, { status: 500 });
    }

    if (!lat || !lon) {
        return NextResponse.json({ error: '緯度または経度が指定されていません。' }, { status: 400 });
    }

    // ★★★ ここのURLを `2.5/onecall` に変更 ★★★
    const forecastApiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly,alerts&appid=${apiKey}&units=metric&lang=ja`;

    try {
        const response = await fetch(forecastApiUrl);
        if (!response.ok) {
            throw new Error('週間天気予報の取得に失敗しました。');
        }
        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: '外部APIへのリクエスト中にエラーが発生しました。' }, { status: 500 });
    }
}