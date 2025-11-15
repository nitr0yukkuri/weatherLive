// src/app/weather/weatherPage.helpers.ts
'use client';

// フックから Forecast 型をインポートするために必要
import type { Forecast } from './useWeatherForecast';

// ===================================
// ヘルパー関数群
// ===================================

export const getWeatherText = (weatherType: string): string => {
    switch (weatherType) {
        case 'partlyCloudy': return '晴れ時々くもり';
        case 'cloudy': return 'くもり';
        case 'clear': return '快晴';
        case 'sunny': return '晴れ';
        case 'rainy': return '雨';
        case 'snowy': return '雪';
        case 'night': return '夜';
        default: return '晴れ';
    }
};

export const getBackgroundColorClass = (weatherType: string | undefined): string => {
    if (!weatherType) return 'bg-sky-200';
    switch (weatherType) {
        case 'sunny':
        case 'night':
        case 'clear':
            return 'bg-orange-200';
        case 'rainy':
            return 'bg-blue-200';
        case 'cloudy':
        case 'partlyCloudy':
            return 'bg-gray-200';
        case 'snowy':
            return 'bg-sky-100';
        default:
            return 'bg-sky-200';
    }
};

export const generateAdviceMessage = (data: { day: string; weather: string; high: number; low: number; pop: number }, index: number): string => {
    const { day, weather, high, low, pop } = data;
    const weatherText = getWeatherText(weather);
    let messages: string[] = [];

    if (weather === 'night') {
        messages = [
            `こんばんは！${day}は最高${high}°C、最低${low}°Cだったみたいだね。`,
            `${day}もおつかれさま！ゆっくり休んでね。`,
            `もう夜だね。${day}の気温は最高${high}°C、最低${low}°Cだったよ。`,
        ];
    } else if (pop >= 50) {
        messages = [
            `☔ ${day}は雨が降るみたい！傘を忘れないでね。`,
            `💧 降水確率は${pop}%だよ。今日はお気に入りのレイングッズを用意しよう！`,
            `🌧️ ${day}は雨模様...。濡れないように気をつけてね。`,
        ];
    } else if (high >= 25) {
        messages = [
            `🥵 ${day}は${high}°Cまで上がるよ！半袖のほうがいいかも。`,
            `☀️ 暑い一日になりそう！水分補給を忘れずにね。`,
            `💦 ${day}はとっても暑くなるよ。熱中症には気をつけて。`,
        ];
    } else if (low <= 5) {
        messages = [
            `🥶 ${day}は${low}°Cまで下がるよ...。しっかり防寒してね。`,
            `❄️ 寒い日が続きそうだね。温かい飲み物を飲んで体を冷やさないように！`,
            `🌬️ ${day}は冷え込む予報だよ。マフラーや手袋が必要かも。`,
        ];
    } else {
        messages = [
            `${day}の天気は${weatherText}だよ。最高${high}°C、最低${low}°C。`,
            `${day}の予報は${weatherText}だね。穏やかな一日になりますように。`,
            `今日（${day}）の天気予報は、${weatherText}！`,
        ];
    }
    const selectedIndex = index % messages.length;
    return messages[selectedIndex];
};