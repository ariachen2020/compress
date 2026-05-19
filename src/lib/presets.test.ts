import { describe, it, expect } from "vitest";
import { DIMENSION_PRESETS, ASPECT_RATIOS } from "./presets";

describe("DIMENSION_PRESETS", () => {
  it("has Original as first preset without dimensions", () => {
    expect(DIMENSION_PRESETS[0].label).toBe("Original");
    expect(DIMENSION_PRESETS[0].width).toBeUndefined();
    expect(DIMENSION_PRESETS[0].height).toBeUndefined();
  });

  it("has Custom as last preset", () => {
    const last = DIMENSION_PRESETS[DIMENSION_PRESETS.length - 1];
    expect(last.label).toBe("Custom");
    expect(last.custom).toBe(true);
  });

  it("has valid width/height for non-original non-custom presets", () => {
    const regular = DIMENSION_PRESETS.filter((p) => !p.custom && p.width);
    for (const preset of regular) {
      expect(preset.width).toBeGreaterThan(0);
      expect(preset.height).toBeGreaterThan(0);
    }
  });
});

describe("ASPECT_RATIOS", () => {
  it("has Free as first option without value", () => {
    expect(ASPECT_RATIOS[0].label).toBe("Free");
    expect(ASPECT_RATIOS[0].value).toBeUndefined();
  });

  it("has correct 16:9 ratio", () => {
    const r = ASPECT_RATIOS.find((r) => r.label === "16:9");
    expect(r?.value).toBeCloseTo(16 / 9);
  });

  it("has correct 1:1 ratio", () => {
    const r = ASPECT_RATIOS.find((r) => r.label === "1:1");
    expect(r?.value).toBe(1);
  });
});
