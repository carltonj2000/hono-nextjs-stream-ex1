"use client";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Home() {
  const [stream, streamSet] = useState("Nothing Yet");
  const callServer = async () => {
    console.log("callServer");
    const result = await fetch("http://localhost:3333");
    const json = await result.json();
    console.log(json);
  };

  const callServerStream = async () => {
    console.log("callServerStream");
    const result = await fetch("http://localhost:3333/stream");
    const reader = result.body?.getReader();
    let done, value;
    while (reader && !done) {
      ({ value, done } = await reader.read());
      if (done) break;
      const data = new TextDecoder().decode(value);
      const j = await JSON.parse(data);
      if (j) streamSet(j);
    }
    console.log(result);
  };

  return (
    <main className="max-w-2xl bg-gray-200 mx-auto flex flex-col">
      <nav className="text-center py-3 bg-gray-300">
        Hono Streaming To NextJS
      </nav>
      <div className="flex flex-col mx-auto py-4 gap-3">
        <Button type="submit" onClick={async () => await callServer()}>
          JSON
        </Button>
        <Button type="submit" onClick={async () => await callServerStream()}>
          Stream
        </Button>
        <div>
          <h1>Stream Data</h1>
          <p>{JSON.stringify(stream)}</p>
        </div>
      </div>
    </main>
  );
}
