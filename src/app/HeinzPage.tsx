"use client";

import Image from "next/image";
import { useState } from "react";
import { Download, Share2, X } from "lucide-react";

export default function HeinzPage() {
    const [text, setText] = useState("");
    const [shake, setShake] = useState(false);
    const [showCurved, setShowCurved] = useState(false);
    const maxChars = 12;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value.length > maxChars) {
            setShake(true);
            setTimeout(() => setShake(false), 300);
            return;
        }
        setText(value);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && text.trim()) {
            setShowCurved(true);
        }
    };

    const handleClear = () => {
        setText("");
        setShowCurved(false);
    };

    // add this helper near top of component
    const generateImage = async (action: "download" | "share") => {
        try {
            // detect device type
            let device: "mobile" | "tablet" | "desktop" = "desktop";
            if (window.innerWidth <= 400) device = "mobile";
            else if (window.innerWidth <= 768) device = "tablet";

            const res = await fetch("/api/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text, device }),
            });

            if (!res.ok) throw new Error("Failed to generate image");
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);

            if (action === "download") {
                const a = document.createElement("a");
                a.href = url;
                a.download = "heinz.png";
                a.click();
            } else if (action === "share" && navigator.share) {
                const file = new File([blob], "heinz.png", { type: "image/png" });
                await navigator.share({
                    files: [file],
                    title: "How do you say Heinz?",
                    text: "#มันส์ต้องHEINZ",
                });
            } else {
                // fallback: just open in new tab
                window.open(url, "_blank");
            }

            URL.revokeObjectURL(url);
        } catch (err) {
            console.error(err);
        }
    };


    return (
        <div className="relative w-full h-screen overflow-hidden">
            {/* 🌆 Background Image */}
            <Image
                src="/images/heinz-bg2.webp"
                alt="Background"
                fill
                priority
                className="object-cover"
            />

            {/* 🍅 Bottle Overlay */}
            <div className="absolute top-0 w-[400px] h-[720px] sm:w-full sm:h-full sm:inset-0 flex justify-center items-center">
                <Image
                    src="/images/bottle.webp"
                    alt="Heinz Bottle"
                    fill
                    priority
                    unoptimized
                    className="
                        object-cover
                        sm:object-contain
                        sm:w-full sm:h-full
                    "
                />
            </div>

            {/* 🔝 Headline */}
            <div className="relative z-10 pt-4 sm:pt-6 lg:pt-6">
                <Image
                    src="/images/headline.webp"
                    alt="คุณเรียก HEINZ ว่าอะไร?"
                    width={500}
                    height={100}
                    className="mx-auto max-w-[80%] sm:max-w-[450px] lg:max-w-[550px]"
                />
            </div>

            {/* 🏺 Input or Curved Text */}
            <div className="relative z-10 flex flex-col items-center flex-1 gap-4 sm:gap-2 h-full">
                {!showCurved ? (
                    // Input Mode
                    <div
                        className={`
              mt-[15vh] flex items-center justify-center
              w-[70%] sm:w-[50%] lg:w-[220px]
              bg-black/60 backdrop-blur-sm
              rounded-[30px] px-3 py-2
              border
              ${text.length >= maxChars ? "border-red-400" : "border-white/40"}
              ${shake ? "animate-shake" : ""}
            `}
                    >
                        <input
                            type="text"
                            value={text}
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
                            maxLength={maxChars}
                            autoFocus
                            placeholder="พิมพ์ชื่อที่คุณเรียก"
                            className={`
                flex-1 text-center font-bold text-white
                bg-transparent outline-none
                text-base sm:text-lg lg:text-[24px]
                placeholder:text-white/80
                max-w-[max-content]
              `}
                        />
                        {text && (
                            <button
                                onClick={handleClear}
                                className="ml-1 text-white/70 hover:text-white transition"
                                aria-label="Clear text"
                            >
                                <X size={14} />
                            </button>
                        )}
                    </div>
                ) : (
                    // Curved Text Mode
                    <div className="absolute top-[0] left-1/2 -translate-x-[48%] z-20 w-[100%] max-w-[440px]">
                        <svg
                            viewBox="0 0 500 200"
                            className="relative z-20 mt-[12vh] w-[100%] max-w-[440px]" // ← removed pointer-events-none
                        >
                            <path
                                id="curve"
                                d="M 60,120 A 180,80 0 0,1 410,120"
                                fill="transparent"
                                stroke="transparent"
                                strokeWidth="1"
                                className="pointer-events-none" // ← path won't steal clicks
                            />

                            <text
                                fill="black"
                                fontSize="42"
                                fontWeight="bold"
                                textAnchor="middle"
                                style={{ fontFamily: '"NotoSansThai", sans-serif' }}
                                className="cursor-pointer focus:outline-none"
                                onClick={handleClear}                 // ← reset on click
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {                   // ← keyboard support
                                    if (e.key === "Enter" || e.key === " ") handleClear();
                                }}
                            >
                                <textPath href="#curve" startOffset="50%">
                                    {text}
                                </textPath>
                            </text>
                        </svg>
                    </div>
                )}

                {/* ⬇️ Buttons + Hashtag anchored to bottom */}
                <div className="absolute bottom-35 left-0 right-0 z-30 flex flex-col items-center gap-3">
                    <div className="flex gap-3 sm:gap-4">
                        <button
                            onClick={() => generateImage("download")}
                            className="bg-white text-black px-4 sm:px-6 py-2 rounded-md font-semibold shadow hover:bg-gray-100 transition text-sm sm:text-base"
                        >
                            <Download className="inline mr-2" size={16} /> Download
                        </button>

                        <button
                            onClick={() => generateImage("share")}
                            className="bg-black text-white px-4 sm:px-6 py-2 rounded-md font-semibold shadow hover:bg-gray-800 transition text-sm sm:text-base"
                        >
                            <Share2 className="inline mr-2" size={16} /> Share
                        </button>
                    </div>

                    <Image
                        src="/images/hashtag.webp"
                        alt="#มันส์ต้องHEINZ"
                        width={250}
                        height={80}
                        className="mx-auto max-w-[70%] sm:max-w-[250px]"
                    />
                </div>
            </div>

            {/* 🌀 Shake Animation */}
            <style jsx>{`
        @keyframes shake {
          0% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-4px);
          }
          50% {
            transform: translateX(4px);
          }
          75% {
            transform: translateX(-4px);
          }
          100% {
            transform: translateX(0);
          }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
        </div>
    );
}
