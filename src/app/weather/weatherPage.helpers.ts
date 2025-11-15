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
        // ★ 変更点: windy, thunderstorm を追加
        case 'windy': return '強風';
        case 'thunderstorm': return '雷雨';
        default: return '晴れ';
    }
};

// ★★★ 変更点: ホーム画面と同一のグラデーション背景クラスに変更 ★★★
export const getBackgroundColorClass = (weatherType: string | undefined): string => {
    if (!weatherType) return 'bg-sunny'; // デフォルトを 'bg-sunny' に変更

    switch (weatherType) {
        case 'clear':
            return 'bg-clear';
        case 'cloudy':
            // 'partlyCloudy' は mapWeatherType が返さないため 'cloudy' に統合
            return 'bg-cloudy';
        case 'rainy':
            return 'bg-rainy';
        case 'thunderstorm':
            return 'bg-thunderstorm';
        case 'snowy':
            return 'bg-snowy';
        case 'windy':
            return 'bg-windy';
        case 'night':
            return 'bg-night';
        case 'sunny':
        default:
            return 'bg-sunny';
    }
};
// ★★★ 変更ここまで ★★★

export const generateAdviceMessage = (data: { day: string; weather: string; high: number; low: number; pop: number }, index: number): string => {
    const { day, weather, high, low, pop } = data;
    // ★ getWeatherText が 'windy' なども処理できるように修正済み
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
        // ★ 変更点: windy, thunderstorm の場合のメッセージを追加
    } else if (weather === 'windy') {
        messages = [
            `🍃 ${day}は風が強いみたい！帽子が飛ばされないように気をつけて。`,
            `🌬️ ${day}の天気は${weatherText}だよ。洗濯物が飛ばされちゃうかも！`,
        ];
    } else if (weather === 'thunderstorm') {
        messages = [
            `⚡ ${day}は雷雨の予報だよ。ゴロゴロ鳴ったら建物に避難してね。`,
            `⛈️ ${day}の天気は${weatherText}！おへそ隠さなきゃ！`,
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