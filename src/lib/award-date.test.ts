import { describe, test } from "node:test";
import { strict as assert } from "node:assert";
import { formatNextAwardDate } from "./award-date";

describe("next award date", () => {
  test("uses the first day of the next month", () => {
    assert.equal(formatNextAwardDate(new Date(2026, 10, 16)), "1 декабря 2026 года");
  });
  test("rolls the next month into the next year", () => {
    assert.equal(formatNextAwardDate(new Date(2026, 11, 31)), "1 января 2027 года");
  });
});
