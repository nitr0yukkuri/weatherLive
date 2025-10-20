// src/app/components/ItemIcon.tsx

import * as Io5 from "react-icons/io5"; // IoSunny, IoCloudyなど
import * as Bs from "react-icons/bs";   // BsCloudSunなど
import * as Fa from "react-icons/fa";   // FaStar, FaSnailなど

// すべてのアイコンライブラリをまとめる
const AllIcons = { ...Io5, ...Bs, ...Fa };

// ★★★ ここから修正しました ★★★
// アイコン名と色の対応表
const colorMap: { [key: string]: string } = {
    'IoSunny': '#FFC700',       // ひまわりのタネ: 黄色
    'BsCloudSunFill': '#FFD700', // てるてるぼうず: 少し明るい黄色
    'IoRainy': '#4682B4',       // あじさい: 青色
    'FaSnail': '#A0522D',       // かたつむりのカラ: 茶色
    'IoCloudy': '#A0A0A0',      // わたぐも: グレー
    'IoSnow': '#6495ED',        // 雪の結晶: 明るい青
    'FaStar': '#FFD700',        // ほしのかけら: 金色
    'IoHelpCircle': '#808080',  // デフォルト: グレー
};
// ★★★ ここまで修正しました ★★★

export default function ItemIcon({ name, size = 24 }: { name: string | null; size?: number }) {
    // ★★★ ここから修正しました ★★★
    const iconColor = (name && colorMap[name]) ? colorMap[name] : colorMap['IoHelpCircle'];

    if (!name || !AllIcons[name]) {
        // アイコン名がないか、対応するアイコンが見つからない場合はデフォルト表示
        return <Io5.IoHelpCircle size={size} color={iconColor} />;
    }
    // ★★★ ここまで修正しました ★★★

    // 文字列からアイコンコンポーネントを取得
    const IconComponent = AllIcons[name];

    // ★★★ ここを修正しました ★★★
    return <IconComponent size={size} color={iconColor} />;
}