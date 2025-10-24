// src/app/api/auth/[...nextauth]/route.ts
import NextAuth, { type NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import EmailProvider from 'next-auth/providers/email';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
// ★★★ 重要: Prisma Client のインポートパスを確認してください ★★★
// もし `src/app/lib/prisma.ts` にある場合はこれでOK
import prisma from '@/app/lib/prisma';

export const authOptions: NextAuthOptions = {
    // Prisma をデータベースアダプターとして使用
    adapter: PrismaAdapter(prisma),

    // 認証プロバイダーの設定
    providers: [
        GoogleProvider({
            // ! マークは環境変数が必ず存在することを TypeScript に伝えるものです
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        EmailProvider({
            // Email プロバイダーの設定 (Resend の例)
            server: {
                host: process.env.EMAIL_SERVER_HOST,
                port: Number(process.env.EMAIL_SERVER_PORT),
                auth: {
                    user: process.env.EMAIL_SERVER_USER, // Resend の場合は 'resend'
                    pass: process.env.EMAIL_SERVER_PASSWORD, // Resend の API キー
                },
            },
            from: process.env.EMAIL_FROM, // 送信元メールアドレス
        }),
        // 他のプロバイダー (GitHub, Twitter など) もここに追加できます
    ],

    // セッション管理の方法 (jwt を推奨)
    session: {
        strategy: 'jwt',
    },

    // JWT (JSON Web Token) にユーザー ID を含めるための設定
    callbacks: {
        async jwt({ token, user }) {
            // ログイン直後 (user オブジェクトが存在する) に、DB 上のユーザー ID をトークンに追加
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            // API ルートなどでセッション情報を取得した際に、トークン内のユーザー ID をセッションオブジェクトに追加
            if (token && session.user) {
                // NextAuth のデフォルトの Session.user 型には id が含まれないため、型アサーションで追加
                (session.user as any).id = token.id;
            }
            return session;
        },
    },

    // ログイン画面などのカスタムページ (今回はデフォルトを使用するためコメントアウト)
    // pages: {
    //   signIn: '/auth/signin',
    // },

    // セキュリティのためのシークレットキー (.env.local で設定したもの)
    secret: process.env.NEXTAUTH_SECRET,

    // 開発中にエラーなどを詳しく表示するかどうか
    debug: process.env.NODE_ENV === 'development',
};

// NextAuth のハンドラーを作成
const handler = NextAuth(authOptions);

// GET リクエストと POST リクエストの両方をこのハンドラーで処理するようにエクスポート
export { handler as GET, handler as POST };