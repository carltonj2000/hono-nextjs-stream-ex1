import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { streamText } from "hono/streaming";

const app = new Hono();
app.use(logger());
app.use(
  "*",
  cors({
    origin: "http://localhost:3000",
    allowHeaders: ["X-Custom-Header", "Upgrade-Insecure-Requests"],
    allowMethods: ["POST", "GET", "OPTIONS"],
    exposeHeaders: ["Content-Length", "X-Kuma-Revision"],
    maxAge: 600,
    credentials: true,
  })
);

app.get("/", (c) => {
  return c.json({ Hello: "Hono!" });
});

app.get("/stream", (c) => {
  return streamText(
    c,
    async (stream) => {
      let count = 0;
      const it = setInterval(() => {
        stream.write(JSON.stringify({ test: "result", count }));
        count++;
      }, 500);
      await new Promise((resolve) =>
        setTimeout(() => {
          clearInterval(it);
          stream.close();
          resolve(4);
        }, 3000)
      );
    },
    async (err, stream) => {
      stream.writeln("An error occurred!");
      console.error(err);
    }
  );
});

const port = 3333;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
