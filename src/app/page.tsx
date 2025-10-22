// src/app/page.tsx
import { headers } from 'next/headers';
import TenChanHomeClient from './components/TenChanHomeClient';

// 型定義
type WeatherType = "sunny" | "rainy" | "cloudy" | "snowy";

// サーバーサイドで天気データを取得する関数
async function getInitialWeatherData(lat: string, lon: string) {
    console.log("getInitialWeatherData called with:", { lat, lon }); // ログ追加
    const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
    if (!apiKey) {
        console.error("API Key is missing!"); // ログ追加
        return null;
    }
    if (!lat || !lon) {
        console.error("Latitude or Longitude is missing!"); // ログ追加
        return null;
    }

    const forecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=ja`;
    console.log("Fetching URL:", forecastApiUrl); // ログ追加

    try {
        // ★★★ キャッシュを無効化 ★★★
        const response = await fetch(forecastApiUrl, { cache: 'no-store' });
        console.log("API Response Status:", response.status); // ログ追加

        if (!response.ok) {
            // エラーレスポンスの内容をログに出力
            let errorBody = 'Could not read error body';
            try {
                errorBody = await response.text();
            } catch (e) {
                console.error("Failed to read error response body:", e);
            }
            console.error("API request failed!", { status: response.status, body: errorBody }); // ログ追加
            return null; // response.ok でない場合は null を返す
        }

        const data = await response.json();

        // データ構造チェック
        if (!data || !data.list || data.list.length === 0 || !data.list[0].weather || data.list[0].weather.length === 0 || !data.list[0].main) {
            console.error("Unexpected API data structure:", data); // ログ追加
            return null;
        }


        const currentWeather = data.list[0];

        const weatherCode = currentWeather.weather[0].main.toLowerCase();
        let weather: WeatherType = "sunny";
        if (weatherCode.includes("rain")) weather = "rainy";
        else if (weatherCode.includes("snow")) weather = "snowy";
        // 注意: 元のコードでは clouds も sunny に分類されていました
        // もし曇りを cloudy にしたい場合は以下の行を追加/変更
        else if (weatherCode.includes("clouds")) weather = "cloudy";


        const result = {
            location: data.city?.name || "どこかの場所", // Optional chaining
            temperature: Math.round(currentWeather.main.temp),
            weather: weather,
        };
        console.log("Processed weather data:", result); // ログ追加
        return result;

    } catch (error) {
        console.error("Failed to fetch or process initial weather:", error); // エラーログ修正
        return null;
    }
}

// page.tsxはサーバーコンポーネント
export default async function TenChanHomePage() {
    const headersList = headers();

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