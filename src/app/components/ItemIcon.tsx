import * as Io5 from "react-icons/io5";
import * as Bs from "react-icons/bs";
import * as Fa from "react-icons/fa";
import * as Gi from "react-icons/gi";

const AllIcons = { ...Io5, ...Bs, ...Fa, ...Gi };

const colorMap: { [key: string]: string } = {
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

export default function ItemIcon({ name, size = 24 }: { name: string | null; size?: number }) {
    const iconColor = (name && colorMap[name]) ? colorMap[name] : colorMap['IoHelpCircle'];

    if (!name || !AllIcons[name as keyof typeof AllIcons]) {
        return <Io5.IoHelpCircle size={size} color={iconColor} />;
    }

    const IconComponent = AllIcons[name as keyof typeof AllIcons];

    return <IconComponent size={size} color={iconColor} />;
}