// src/app/components/SessionProviderWrapper.tsx (新規作成)
'use client'; // これはクライアントコンポーネントですよ、という印

import { SessionProvider } from 'next-auth/react';
import React from 'react';

type Props = {
    children?: React.ReactNode;
};

// NextAuth の SessionProvider をラップするコンポーネント
export default function SessionProviderWrapper({ children }: Props) {
    // SessionProvider で子要素 (アプリ全体) を囲む
    return <SessionProvider>{children}</SessionProvider>;
}