"use client";
import { Button } from "@mantine/core";

export default function HomePage() {
  return (
    <div>
      <h1>Mantine の動作確認</h1>
      <Button onClick={() => alert("Mantine ボタンがクリックされました")}>
        Mantine ボタン
      </Button>
    </div>
  );
}
