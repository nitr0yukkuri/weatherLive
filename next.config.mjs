/** @type {import('next').NextConfig} */

// --- ▼▼▼ 変更点 (PWA対応) ▼▼▼ ---
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const withPWA = require('next-pwa')({
    dest: 'public',
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === 'development', // 開発中はPWAを無効化
});
// --- ▲▲▲ 変更点ここまで ▲▲▲ ---

const nextConfig = {};

// --- ▼▼▼ 変更点 (PWA対応) ▼▼▼ ---
export default withPWA(nextConfig);
// --- ▲▲▲ 変更点ここまで ▲▲▲ ---