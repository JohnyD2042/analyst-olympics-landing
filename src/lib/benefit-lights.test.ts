import { test } from "node:test";
import { strict as assert } from "node:assert";
import { shouldHintBenefitPull, toggleBenefitLight } from "./benefit-lights";

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

test("pull hint returns whenever all three cards are closed", () => {
  assert.equal(shouldHintBenefitPull([false, false, false]), true);
  for (const index of [0, 1, 2]) {
    const open = toggleBenefitLight([false, false, false], index);
    assert.equal(shouldHintBenefitPull(open), false);
    assert.equal(shouldHintBenefitPull(toggleBenefitLight(open, index)), true);
  }
});