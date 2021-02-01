import { assertEquals } from "https://deno.land/std@0.85.0/testing/asserts.ts";
import { Color } from "../Game.ts";
import { Position } from "../Position.ts";

Deno.test("up from A1 should be A2", () => {
  const position = Position.create("A1");
  assertEquals(position.up()?.toString(), `A2`);
});

Deno.test("up from B8 should be null", () => {
  const position = Position.create("B8");
  assertEquals(position.up(), null);
});

Deno.test("white forward from D4 should be D5", () => {
  const position = Position.create("D4");
  assertEquals(position.forward(Color.White)?.toString(), `D5`);
});

Deno.test("black forward from D4 should be D3", () => {
  const position = Position.create("D4");
  assertEquals(position.forward(Color.Black)?.toString(), `D3`);
});

Deno.test("static create", () => {
  const position = Position.create("D5");
  assertEquals(position.toString(), Position.create("D5").toString());
});
