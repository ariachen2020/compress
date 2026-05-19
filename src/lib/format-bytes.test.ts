import { describe, it, expect } from "vitest";
import { formatBytes, savingsPercent } from "./format-bytes";

describe("formatBytes", () => {
  it("formats 0 bytes", () => {
    expect(formatBytes(0)).toBe("0 B");
  });

  it("formats bytes", () => {
    expect(formatBytes(500)).toBe("500 B");
  });

  it("formats kilobytes", () => {
    expect(formatBytes(1024)).toBe("1 KB");
    expect(formatBytes(1536)).toBe("1.5 KB");
  });

  it("formats megabytes", () => {
    expect(formatBytes(1048576)).toBe("1 MB");
    expect(formatBytes(1258291)).toBe("1.2 MB");
  });

  it("formats gigabytes", () => {
    expect(formatBytes(1073741824)).toBe("1 GB");
  });
});

describe("savingsPercent", () => {
  it("returns 0 for zero original size", () => {
    expect(savingsPercent(0, 0)).toBe(0);
  });

  it("calculates savings correctly", () => {
    expect(savingsPercent(1000, 700)).toBe(30);
    expect(savingsPercent(1200000, 700000)).toBe(42);
  });

  it("handles case where compressed is larger", () => {
    expect(savingsPercent(500, 600)).toBe(-20);
  });

  it("handles 100% savings", () => {
    expect(savingsPercent(1000, 0)).toBe(100);
  });
});
