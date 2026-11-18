import { describe, test } from "node:test";
import { strict as assert } from "node:assert";
import { CONTEST_2026 } from "./contest-2026";

describe("contest 2026", () => {
  test("fund is 6 300 000 rubles", () => assert.equal(CONTEST_2026.fund, 6_300_000));
  test("seven months award 900 000 rubles each", () => {
    assert.equal(CONTEST_2026.months, 7);
    assert.equal(CONTEST_2026.monthlyFund, 900_000);
    assert.equal(CONTEST_2026.months * CONTEST_2026.monthlyFund, CONTEST_2026.fund);
  });
  test("contest ends on December 31, 2026", () => assert.equal(CONTEST_2026.endsOn, "2026-12-31"));
});