// src/app/lib/session.ts (新規作成)
import { getServerSession } from 'next-auth/next';
// ★★★ パスを確認！ APIルートでエクスポートした authOptions をインポート ★★★
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

/**
 * サーバーサイドで現在のログインユーザーのセッションとIDを取得する
 * @returns {Promise<{ session: Session; userId: string } | null>} ログインしていればセッションとユーザーID、していなければ null
 */
export async function getCurrentUser() {
    // サーバーコンポーネントやAPIルートでセッション情報を取得
    const session = await getServerSession(authOptions);

    // セッションが存在し、かつセッション情報にユーザーIDが含まれているか確認
    // (authOptions の callbacks で設定した id を参照)
    if (!session?.user || !(session.user as any).id) {
        return null; // ログインしていない場合は null を返す
    }

    // 型安全のため、id を取り出す (as any を使っているのは、NextAuth のデフォルト型に id がないため)
    const userId = (session.user as any).id as string;

    // セッションオブジェクトと userId を返す
    return { session, userId };
}