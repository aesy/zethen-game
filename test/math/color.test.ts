import { describe, expect, it } from "vitest";
import { Color } from "@/engine/math/color";

describe("Color", () => {
  describe(".fromRGB", () => {
    it("should create an instance from rgba values", () => {
      expect(Color.fromRGB(1, 2, 3, 4).toString()).toEqual("rgba(1,2,3,4)");
    });
  });
});
