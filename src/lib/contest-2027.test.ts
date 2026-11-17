import { describe, test } from "node:test";
import { strict as assert } from "node:assert";
import { CONTEST_2027, formatContest2027AwardDate } from "./contest-2027";

describe("contest 2027", () => {
  test("scramble repeats every three seconds", () => assert.equal(CONTEST_2027.scrambleInterval, 3_000));
  test("fund is 3 million over six awards of 500 thousand", () => {
    assert.equal(CONTEST_2027.fund, 3_000_000);
    assert.equal(CONTEST_2027.months, 6);
    assert.equal(CONTEST_2027.monthlyFund, 500_000);
    assert.equal(CONTEST_2027.months * CONTEST_2027.monthlyFund, CONTEST_2027.fund);
    assert.equal(CONTEST_2027.prizes.reduce((sum, prize) => sum + prize, 0), CONTEST_2027.monthlyFund);
  });
  test("first prize is 300 thousand", () => assert.equal(CONTEST_2027.prizes[0], 300_000));
  test("second prize is 150 thousand", () => assert.equal(CONTEST_2027.prizes[1], 150_000));
  test("third prize is 50 thousand", () => assert.equal(CONTEST_2027.prizes[2], 50_000));
  test("first award stays January 1 before launch", () => {
    assert.equal(formatContest2027AwardDate(new Date("2026-11-17T15:22:00Z")), "1 января 2027 года");
    assert.equal(formatContest2027AwardDate(new Date("2026-12-31T20:59:59Z")), "1 января 2027 года");
  });
  test("January boundary advances to February in Moscow", () => {
    assert.equal(formatContest2027AwardDate(new Date("2026-12-31T21:00:00Z")), "1 февраля 2027 года");
  });
  test("February boundary advances to March", () => {
    assert.equal(formatContest2027AwardDate(new Date("2027-01-31T21:00:00Z")), "1 марта 2027 года");
  });
  test("March boundary advances to April", () => {
    assert.equal(formatContest2027AwardDate(new Date("2027-02-28T21:00:00Z")), "1 апреля 2027 года");
  });
  test("year boundary keeps advancing", () => {
    assert.equal(formatContest2027AwardDate(new Date("2027-12-10T12:00:00Z")), "1 января 2028 года");
  });
});