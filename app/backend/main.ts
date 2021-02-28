import { Application, path } from "./deps.ts";
import { jsxLoader } from "./jsx_loader.ts";

const app = new Application();
app.start({ port: 8080 });

const staticRoot = "../frontend";

app
  .get("/", (c) => c.file(`${staticRoot}/index.html`))
  .post("/move", (c) => {
    const { player, move } = c.queryParams;
    console.log("POST: player:", player, "? move:", move);
    return `Player '${player}' wants to perform move "${move}"`;
  })
  .static("/", staticRoot, jsxLoader, (n) =>
    (c) => {
      c.set("realpath", path.join(staticRoot, c.path));
      return n(c);
    });

console.log(`server listening on http://localhost:8080`);
