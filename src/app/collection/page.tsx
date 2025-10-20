// src/app/collection/page.tsx

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ItemIcon from '../components/ItemIcon';
import Footer from '../components/Footer';
interface CollectionItem {
    id: number;
    name: string;
    description: string;
    iconName: string | null;
    quantity: number;
}

export default function CollectionPage() {
    const [collection, setCollection] = useState<CollectionItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCollection = async () => {
            try {
                const response = await fetch('/api/collection');
                const data = await response.json();
                setCollection(data);
            } catch (error) {
                console.error("コレクションの取得に失敗しました", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCollection();
    }, []);

    return (
        <div className="w-full min-h-screen bg-gray-200 flex items-center justify-center p-4">
            <main className="w-full max-w-sm h-[640px] rounded-3xl shadow-2xl overflow-hidden relative flex flex-col bg-orange-100 text-slate-700">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-32 bg-black/80 rounded-b-xl z-10"></div>

                <div className="flex-grow overflow-y-auto p-6">
                    <header className="mb-8">
                        <Link href="/" className="text-slate-500 mb-6 inline-block text-sm hover:text-slate-700 transition-colors">← もどる</Link>
                        <h1 className="text-4xl font-extrabold text-slate-800 tracking-wider">ずかん</h1>
                        <p className="text-slate-500 mt-1">集めたアイテムを見てみよう</p>
                    </header>

                    {loading ? (
                        <p className="text-center animate-pulse">読み込み中...</p>
                    ) : (
                        <div className="grid grid-cols-4 gap-4">
                            {collection.map(item => (
                                <div key={item.id} className="flex flex-col items-center justify-center p-2 bg-white/60 rounded-xl aspect-square">
                                    <div className={`relative transition-opacity ${item.quantity === 0 ? 'opacity-30' : ''}`}>
                                        <ItemIcon name={item.iconName} size={40} />
                                        {item.quantity > 0 && (
                                            <span className="absolute -top-1 -right-2 bg-slate-700 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                                {item.quantity}
                                            </span>
                                        )}
                                    </div>
                                    <p className={`text-xs text-center mt-1 ${item.quantity === 0 ? 'text-slate-400' : 'text-slate-600 font-bold'}`}>
                                        {item.quantity > 0 ? item.name : '？？？'}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <Footer />
            </main>
        </div>
    );
}