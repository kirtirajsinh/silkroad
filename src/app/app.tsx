"use client";

import dynamic from "next/dynamic";

// const Demo = dynamic(() => import("~/components/Demo"), {
//   ssr: false,
// });
const Sell = dynamic(() => import("~/components/Sell"), {
  ssr: false,
});

export default function App() {
  // { title }: { title?: string } = { title: "Frames v2 Demo" }
  return <Sell />;
}
