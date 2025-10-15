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
        // ★★★ この行を変更しました！ ★★★
        // 10分間（600秒）キャッシュするように設定を追加
        const response = await fetch(forecastApiUrl, { next: { revalidate: 600 } });

        // レスポンスがOKでない場合、エラー内容を詳しく調査する
        if (!response.ok) {
            // ★★★ APIからのエラー応答をJSONとして解析し、ログに出力 ★★★
            const errorData = await response.json();
            console.error('OpenWeatherMap API Error Response:', errorData);
            throw new Error(errorData.message || '週間天気予報の取得に失敗しました。');
        }

        const data = await response.json();
        return NextResponse.json(data);

    } catch (error: any) {
        // エラーメッセージをコンソールに出力
        console.error('API Route Error:', error.message);
        return NextResponse.json({ message: error.message || '外部APIへのリクエスト中にエラーが発生しました。' }, { status: 500 });
    }
}