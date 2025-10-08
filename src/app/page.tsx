'use client';

import { useState } from 'react';
import CharacterFace from './components/CharacterFace';
import SunIcon from './components/SunIcon';
import Footer from './components/Footer';

export default function TenChanHome() {
    const [characterName] = useState('てんちゃん');
    const [bgImage, setBgImage] = useState('');
    const [bgColor, setBgColor] = useState('#FEFBF6');

    return (
        <div className="w-full min-h-screen bg-pink-100 flex items-center justify-center p-4">
            <main
                className="w-full max-w-sm h-[640px] rounded-3xl shadow-2xl overflow-hidden relative flex flex-col text-[#5D4037] bg-cover bg-center"
                style={{
                    backgroundColor: bgColor,
                    backgroundImage: bgImage ? `url(${bgImage})` : 'none',
                }}
            >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-32 bg-black rounded-b-xl z-10"></div>

                <div className="flex-grow flex flex-col items-center justify-center gap-y-3 p-3">
                    <div className="flex flex-col items-center mb-1">
                        <SunIcon />
                        <p className="text-sm mt-1 text-pink-500">16:15・22℃・Tokyo</p>
                    </div>

                    <div className="flex flex-col items-center text-center">
                        <div className="w-52 h-52 rounded-full bg-pink-200/50 p-2 shadow-inner backdrop-blur-sm">
                            <div className="w-full h-full rounded-full border-[3px] border-pink-400/60 flex items-center justify-center">
                                <CharacterFace />
                            </div>
                        </div>
                        <h1 className="text-2xl font-bold mt-2 backdrop-blur-sm bg-white/30 rounded-lg px-2">{characterName}</h1>
                    </div>
                </div>

                <Footer />

            </main>
        </div>
    );
}