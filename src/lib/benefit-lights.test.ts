import { test } from "node:test";
import { strict as assert } from "node:assert";
import { toggleBenefitLight } from "./benefit-lights";

test("three cords independently reveal their own benefit", () => {
  const first = toggleBenefitLight([false, false, false], 0);
  assert.deepEqual(first, [true, false, false]);
  const second = toggleBenefitLight(first, 1);
  assert.deepEqual(second, [true, true, false]);
  const third = toggleBenefitLight(second, 2);
  assert.deepEqual(third, [true, true, true]);
});

test("pulling an enabled cord switches only its own light off", () => {
  assert.deepEqual(toggleBenefitLight([true, true, true], 1), [true, false, true]);
});