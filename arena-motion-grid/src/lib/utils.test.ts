import { describe, it, expect } from "vitest";
import { cn } from "./utils";

describe("cn", () => {
  it("joins class names and skips falsy values", () => {
    expect(cn("a", false && "b", undefined, null, "c")).toBe("a c");
  });

  it("lets later tailwind classes override conflicting earlier ones", () => {
    expect(cn("p-2 text-red-500", "p-4")).toBe("text-red-500 p-4");
  });

  it("supports object syntax", () => {
    expect(cn({ active: true, hidden: false })).toBe("active");
  });
});
