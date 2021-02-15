import { Application } from "https://deno.land/x/abc@v1.2.4/mod.ts";
import { HandlerFunc } from "https://deno.land/x/abc@v1.2.4/types.ts";
import { acceptWebSocket } from "https://deno.land/std@0.81.0/ws/mod.ts";

const app = new Application();

const hello: HandlerFunc = async (c) => {
  const { conn, headers, r: bufReader, w: bufWriter } = c.request;
  const ws = await acceptWebSocket({
    conn,
    headers,
    bufReader,
    bufWriter,
  });

  for await (const e of ws) {
    console.log("Got message:", e);
    if (e.toString() === "start") {
      await ws.send("OK");
    } else if (e.toString() === "quit") {
      await ws.close();
      break;
    } else {
      await ws.send("Try again");
    }
  }
  console.log("Handler exit");
};

app.get("/ws", hello).file("/", "./index.html").start({ port: 8080 });

console.log(`server listening on http://localhost:8080`);
