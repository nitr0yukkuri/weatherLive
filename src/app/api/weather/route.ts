import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');

    const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;

    if (!apiKey) {
        return NextResponse.json({ message: 'APIキーが設定されていません。' }, { status: 500 });
    }
    if (!lat || !lon) {
        return NextResponse.json({ message: '緯度または経度が指定されていません。' }, { status: 400 });
    }

    const forecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=ja`;

    try {
        const response = await fetch(forecastApiUrl);
        const data = await response.json(); // 先にJSONとしてパースを試みる

        // response.okがfalseの場合、OpenWeatherMapからのエラー内容をそのままクライアントに転送する
        if (!response.ok) {
            console.error('OpenWeatherMap API Error:', data);
            // APIから返されたエラーメッセージとステータスコードをそのまま利用する
            return NextResponse.json({ message: data.message || '天気情報の取得に失敗しました。' }, { status: response.status });
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Internal Server Error:', error);
        return NextResponse.json({ message: 'サーバー内部でエラーが発生しました。' }, { status: 500 });
    }
}