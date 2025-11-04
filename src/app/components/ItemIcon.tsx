import * as Io5 from "react-icons/io5";
import * as Bs from "react-icons/bs";
import * as Fa from "react-icons/fa";
import * as Gi from "react-icons/gi";

const AllIcons = { ...Io5, ...Bs, ...Fa, ...Gi };

const iconColorMap: { [key: string]: string } = {
    'IoSunny': '#FFC700',
    'BsSunFill': '#FFB300',
    'IoRainy': '#4682B4',
    'GiSnail': '#A0522D',
    // ★★★ 雷の色を黄色系に変更 ★★★
    'IoThunderstorm': 'gold',
    'IoCloudy': '#A0A0A0',
    // ★★★ 雪の結晶アイコンは IoSnow のまま（天候アイコンだけ変更） ★★★
    'IoSnow': '#6495ED',
    'FaStar': '#FFD700',
    // ★★★ 風のアイコンを GiWhirlwind に変更 ★★★
    'GiWhirlwind': '#34d399',
    'IoHelpCircle': '#808080',
};

// ★ レア度に応じた色（主に汎用アイコン用）を新しく追加
const rarityColorMap: { [key: string]: string } = {
    'normal': '#808080',      // Gray
    'uncommon': '#34d399',    // Emerald / Green
    'rare': '#60a5fa',        // Blue
    'epic': '#a855f7',        // Purple
    'legendary': '#f59e0b',   // Amber / Gold
};


export default function ItemIcon({ name, rarity = 'normal', size = 24 }: { name: string | null; rarity?: string; size?: number }) {
    // 1. アイコン名に固有の色が設定されているか確認
    let iconColor = (name && iconColorMap[name])
        ? iconColorMap[name]
        // 2. 設定されていない場合はレア度に応じて色を決定
        : rarityColorMap[rarity] ?? rarityColorMap.normal;


    if (!name || !AllIcons[name as keyof typeof AllIcons]) {
        // 不明なアイテムは既存のデフォルト色を使用
        iconColor = iconColorMap['IoHelpCircle'];
        return <Io5.IoHelpCircle size={size} color={iconColor} />;
    }

    const IconComponent = AllIcons[name as keyof typeof AllIcons];

    return <IconComponent size={size} color={iconColor} />;
}