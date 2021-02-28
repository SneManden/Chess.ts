import { decode, HandlerFunc, Header, MiddlewareFunc, MIME } from "./deps.ts";
const { emit, readFile } = Deno;

export const jsxLoader: MiddlewareFunc = (next: HandlerFunc) =>
  async (c) => {
    const filepath = c.get("realpath") as string | undefined;

    if (filepath && /\.[j|t]sx?$/.test(filepath)) {
      c.response.headers.set(
        Header.ContentType,
        MIME.ApplicationJavaScriptCharsetUTF8,
      );
      const f = await readFile(filepath);

      // My rewrite of deprecated transpileOnly using emit 
      const emitted = await emit(filepath, { compilerOptions: { jsx: "react" } });
      const source = Object.entries(emitted.files).find(([path, _source]) => path.endsWith(filepath.replace("../", "") + ".js"))?.[1];
      return source;
      // End rewrite
    }

    return next(c);
  };
