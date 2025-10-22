import { headers } from 'next/headers';
import TenChanHomeClient from './components/TenChanHomeClient';

// 型定義 (★ここに追加！)
type WeatherType = "sunny" | "rainy" | "cloudy" | "snowy";

// サーバーサイドで天気データを取得する関数
async function getInitialWeatherData(lat: string, lon: string) {
    console.log("getInitialWeatherData called with:", { lat, lon });
    const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
    if (!apiKey) {
        console.error("API Key is missing!");
        return null;
    }
    if (!lat || !lon) {
        console.error("Latitude or Longitude is missing!");
        return null;
    }

    const forecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=ja`;
    console.log("Fetching URL:", forecastApiUrl);

    try {
        const response = await fetch(forecastApiUrl, { cache: 'no-store' });
        console.log("API Response Status:", response.status);

        if (!response.ok) {
            let errorBody = 'Could not read error body';
            try {
                errorBody = await response.text();
            } catch (e) {
                console.error("Failed to read error response body:", e);
            }
            console.error("API request failed!", { status: response.status, body: errorBody });
            return null;
        }

        const data = await response.json();

        if (!data || !data.list || data.list.length === 0 || !data.list[0].weather || data.list[0].weather.length === 0) {
            console.error("Unexpected API data structure:", data);
            return null;
        }

        const currentWeather = data.list[0];
        const weatherCode = currentWeather.weather[0].main.toLowerCase();
        let weather: WeatherType = "sunny"; // ← ここで WeatherType が使われている
        if (weatherCode.includes("rain")) weather = "rainy";
        else if (weatherCode.includes("snow")) weather = "snowy";
        else if (weatherCode.includes("clouds")) weather = "cloudy";

        const result = {
            location: data.city?.name || "どこかの場所",
            temperature: Math.round(currentWeather.main.temp),
            weather: weather,
        };
        console.log("Processed weather data:", result);
        return result;

    } catch (error) {
        console.error("Failed to fetch or process initial weather:", error);
        return null;
    }
}

// page.tsxはサーバーコンポーネント
export default async function TenChanHomePage() {
    const headersList = headers();
    const lat = headersList.get('x-vercel-ip-latitude') || '34.6864';
    const lon = headersList.get('x-vercel-ip-longitude') || '135.5200';
    const initialWeatherData = await getInitialWeatherData(lat, lon);

    return (
        <TenChanHomeClient initialData={initialWeatherData} />
    );
}