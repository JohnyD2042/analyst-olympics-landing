export type BenefitLights = readonly [boolean, boolean, boolean];

export function shouldHintBenefitPull(lights: BenefitLights): boolean {
  return lights.every((on) => !on);
}

export function toggleBenefitLight(lights: BenefitLights, index: number): BenefitLights {
  return [
    index === 0 ? !lights[0] : lights[0],
    index === 1 ? !lights[1] : lights[1],
    index === 2 ? !lights[2] : lights[2],
  ];
}