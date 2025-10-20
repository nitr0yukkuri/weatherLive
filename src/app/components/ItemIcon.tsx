// src/app/components/ItemIcon.tsx

import * as Io5 from "react-icons/io5"; // IoSunny, IoCloudyなど
import * as Bs from "react-icons/bs";   // BsCloudSunなど
import * as Fa from "react-icons/fa";   // FaStarなど
import * as Gi from "react-icons/gi";   // ★★★ Game Iconsを追加 ★★★

// すべてのアイコンライブラリをまとめる
const AllIcons = { ...Io5, ...Bs, ...Fa, ...Gi }; // ★★★ Giを追加 ★★★

// アイコン名と色の対応表
const colorMap: { [key: string]: string } = {
    'IoSunny': '#FFC700',
    'BsCloudSunFill': '#FFD700',
    'IoRainy': '#4682B4',
    'GiSnail': '#A0522D',        // ★★★ アイコン名を GiSnail に変更 ★★★
    'IoCloudy': '#A0A0A0',
    'IoSnow': '#6495ED',
    'FaStar': '#FFD700',
    'IoHelpCircle': '#808080',
};

export default function ItemIcon({ name, size = 24 }: { name: string | null; size?: number }) {
    const iconColor = (name && colorMap[name]) ? colorMap[name] : colorMap['IoHelpCircle'];

    if (!name || !AllIcons[name]) {
        return <Io5.IoHelpCircle size={size} color={iconColor} />;
    }

    const IconComponent = AllIcons[name];

    return <IconComponent size={size} color={iconColor} />;
}