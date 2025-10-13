import { headers } from 'next/headers';
import TenChanHomeClient from './components/TenChanHomeClient';

// 型定義
type WeatherType = "sunny" | "rainy" | "cloudy" | "snowy";

// サーバーサイドで天気データを取得する関数
async function getInitialWeatherData(lat: string, lon: string) {
    const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
    if (!apiKey || !lat || !lon) return null;

    const forecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=ja`;

    try {
        const response = await fetch(forecastApiUrl, { next: { revalidate: 600 } });
        if (!response.ok) return null;
        const data = await response.json();
        const currentWeather = data.list[0];

        const weatherCode = currentWeather.weather[0].main.toLowerCase();
        let weather: WeatherType = "sunny";
        if (weatherCode.includes("rain")) weather = "rainy";
        else if (weatherCode.includes("snow")) weather = "snowy";
        else if (weatherCode.includes("clouds")) weather = "cloudy";

        return {
            location: data.city.name || "どこかの場所",
            temperature: Math.round(currentWeather.main.temp),
            weather: weather,
        };
    } catch (error) {
        console.error("Failed to fetch initial weather:", error);
        return null;
    }
}

// page.tsxはサーバーコンポーネント
export default async function TenChanHomePage() {
    // ★★★★★ ここに await を追加 ★★★★★
    const headersList = await headers();
    // ★★★★★★★★★★★★★★★★★★★★★★★

    // Vercel環境でIPから緯度経度を取得 (ローカルでは大阪にフォールバック)
    const lat = headersList.get('x-vercel-ip-latitude') || '34.6864';
    const lon = headersList.get('x-vercel-ip-longitude') || '135.5200';

    // サーバーサイドで初期データを取得
    const initialWeatherData = await getInitialWeatherData(lat, lon);

    return (
        // 取得した初期データをクライアントコンポーネントに渡す
        <TenChanHomeClient initialData={initialWeatherData} />
    );
}