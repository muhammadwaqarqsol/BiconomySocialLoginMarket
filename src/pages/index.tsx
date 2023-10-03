import dynamic from "next/dynamic";
// Use inter from next/font
import { Suspense } from "react";

// Dynamically import the `Wallet` component to make sure we don't get SSR errors
const Wallet = dynamic(
  () => import("../components/Wallet").then((res) => res.default),
  { ssr: false }
);

export default function Home() {
  return (
    <main>
      <Suspense fallback={<div>Loading...</div>}>{<Wallet />}</Suspense>
    </main>
  );
}
