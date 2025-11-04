// src/app/page.tsx
import { headers } from 'next/headers';
import TenChanHomeClient from './components/TenChanHomeClient';

// 型定義
type WeatherType = "sunny" | "clear" | "rainy" | "cloudy" | "snowy" | "thunderstorm" | "windy" | "night";

// ★★★ ここから修正 (TenChanHomeClient.tsx から詳細な判定ロジックを移植) ★★★
const mapWeatherType = (weatherData: any): WeatherType => {
    // weatherData や weatherData.weather が存在しない場合のガードを追加
    if (!weatherData || !weatherData.weather || weatherData.weather.length === 0) {
        return "sunny"; // 不明な場合は sunny を返す
    }

    const main = weatherData.weather[0].main.toLowerCase();
    const windSpeed = weatherData.wind?.speed; // wind が存在しない可能性も考慮

    // サーバーサイドでの実行のため、現在時刻（UTCまたはサーバー時刻）を取得
    const hour = new Date().getHours();
    const isNight = hour < 5 || hour >= 19;

    // ★ 1. まず重要な天候（風、雷、雨、雪）を先に判定
    if (windSpeed !== undefined && windSpeed >= 10) return "windy";
    if (main.includes("thunderstorm")) return "thunderstorm";
    if (main.includes("rain")) return "rainy";
    if (main.includes("snow")) return "snowy";

    // ★ 2. その他の天候（曇り、快晴）を判定
    if (main.includes("clouds")) return "cloudy";
    if (main.includes("clear")) {
        // ★ 3. 快晴（clear）の時だけ、夜かどうかをチェック
        return isNight ? "night" : "clear";
    }

    // ★ 4. デフォルト（sunnyなど）の場合も、夜かどうかをチェック
    return isNight ? "night" : "sunny";
};
// ★★★ 修正ここまで ★★★


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

        // データ構造チェック (★ 修正: wind もチェック対象に含める)
        if (!data || !data.list || data.list.length === 0 || !data.list[0].weather || data.list[0].weather.length === 0 || !data.list[0].main || !data.list[0].wind) {
            console.error("Unexpected API data structure:", data); // ログ追加
            return null;
        }


        const currentWeather = data.list[0];

        // ★★★ ここを修正 (移植した mapWeatherType を使う) ★★★
        const weather = mapWeatherType(currentWeather);
        // ★★★ 修正ここまで ★★★

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