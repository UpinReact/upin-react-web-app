// app/components/HeaderLottie.tsx
"use client";

import dynamic from "next/dynamic";
import locationLottie from "../../../public/locationLottie.json";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export default function HeaderLottie({ className }: { className?: string }) {
  return (
    <div className={className}>
      <Lottie animationData={locationLottie} style={{ width: "100%", height: "100%" }} />
    </div>
  );
}
