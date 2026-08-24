"use client";

import dynamic from "next/dynamic";

const FigurineScene = dynamic(
  () => import("./figurine-scene").then((m) => m.FigurineScene),
  {
    ssr: false,
    loading: () => null,
  },
);

export function FigurineMount() {
  return <FigurineScene />;
}
