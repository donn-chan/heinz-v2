"use client";

import Image from "next/image";
import { useState } from "react";
import { Download, Share2, X } from "lucide-react";

export default function HeinzPage() {
  const [text, setText] = useState("");
  const [shake, setShake] = useState(false);
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
      <div className="absolute inset-0 flex justify-center items-center">
        <Image
          src="/images/bottle.webp"
          alt="Heinz Bottle"
          fill
          priority
          className="object-contain w-auto h-screen mx-auto"
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

      {/* 🏺 Input + Buttons */}
      <div className="relative z-10 flex flex-col items-center flex-1 gap-4 sm:gap-2 h-full">
        {/* Keystone Input */}
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
        </div>
        <div className="flex flex-col gap-2 mt-[50vh]">
            {/* ⬇️ Buttons */}
            <div className="flex gap-3 sm:gap-4">
            <button
                onClick={() => console.log("Download")}
                className="bg-white text-black px-4 sm:px-6 py-2 rounded-md font-semibold shadow hover:bg-gray-100 transition text-sm sm:text-base"
            >
                <Download className="inline mr-2" size={16} /> Download
            </button>
            <button
                onClick={() => console.log("Share")}
                className="bg-black text-white px-4 sm:px-6 py-2 rounded-md font-semibold shadow hover:bg-gray-800 transition text-sm sm:text-base"
            >
                <Share2 className="inline mr-2" size={16} /> Share
            </button>
            </div>

            {/* 📢 Hashtag */}
            <div className="relative z-10 pb-4 sm:pb-6 lg:pb-8">
                <Image
                    src="/images/hashtag.webp"
                    alt="#มันส์ต้องHEINZ"
                    width={250}
                    height={80}
                    className="mx-auto max-w-[70%] sm:max-w-[250px]"
                />
            </div>
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
