// 例: components/ItemIcon.tsx (新しく作るコンポーネント)

import * as Io5 from "react-icons/io5"; // IoSunny, IoCloudyなど
import * as Bs from "react-icons/bs";   // BsCloudSunなど
import * as Fa from "react-icons/fa";   // FaStar, FaSnailなど

// すべてのアイコンライブラリをまとめる
const AllIcons = { ...Io5, ...Bs, ...Fa };

export default function ItemIcon({ name, size = 24 }: { name: string | null; size?: number }) {
    if (!name || !AllIcons[name]) {
        // アイコン名がないか、対応するアイコンが見つからない場合はデフォルト表示
        return <Io5.IoHelpCircle size={size} />;
    }

    // 文字列からアイコンコンポーネントを取得
    const IconComponent = AllIcons[name];

    return <IconComponent size={size} />;
}


// 使い方
// <ItemIcon name={"IoSunny"} />  ← DBから取得した "IoSunny" を渡す