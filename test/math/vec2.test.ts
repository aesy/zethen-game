import { describe, expect, it } from "vitest";
import { Vec2 } from "@/engine/math/vec2";

describe("Vec2", () => {
  describe(".unit", () => {
    it("should return a vector with the given angle", () => {
      expect(Vec2.unit(0).x).toBeCloseTo(1);
      expect(Vec2.unit(0).y).toBeCloseTo(0);
      expect(Vec2.unit(Math.PI / 2).x).toBeCloseTo(0);
      expect(Vec2.unit(Math.PI / 2).y).toBeCloseTo(1);
      expect(Vec2.unit(Math.PI).x).toBeCloseTo(-1);
      expect(Vec2.unit(Math.PI).y).toBeCloseTo(0);
      expect(Vec2.unit(Math.PI * 2).x).toBeCloseTo(1);
      expect(Vec2.unit(Math.PI * 2).y).toBeCloseTo(0);
    });
  });

  describe(".fromPoint", () => {
    // TODO
  });

  describe(".zero", () => {
    it("should return a vector with components of 0", () => {
      expect(Vec2.zero()).toEqual({ x: 0, y: 0 });
    });
  });

  describe("#magnitude", () => {
    it("should return the length of a vector", () => {
      const vec = new Vec2(3, 5);

      expect(Vec2.zero().magnitude).toEqual(0);
      expect(vec.magnitude).toEqual(5.830951894845301);
    });

    it("should be mutable", () => {
      const vec = Vec2.unit(20);
      vec.magnitude = 5;

      expect(vec.magnitude).toEqual(5);
      expect(vec.x).toEqual(2.0404103090669596);
      expect(vec.y).toEqual(4.564726253638138);
    });
  });

  describe("#magnitudeSquared", () => {
    it("should return the squared length of a vector", () => {
      const vec = new Vec2(3, 5);

      expect(Vec2.zero().magnitudeSquared).toEqual(0);
      expect(vec.magnitudeSquared).toEqual(34);
    });
  });

  describe("#angle", () => {
    it("should return the angle of a vector", () => {
      const vec = new Vec2(3, 5);

      expect(Vec2.zero().angle).toEqual(0);
      expect(vec.angle).toEqual(1.0303768265243125);
    });

    it("should be mutable", () => {
      const vec = Vec2.unit(20);
      vec.angle = Math.PI / 2;

      expect(vec.angle).toBeCloseTo(Math.PI / 2);
      expect(vec.x).toBeCloseTo(0);
      expect(vec.y).toBeCloseTo(1);
    });
  });

  describe("#dot", () => {
    // TODO
  });

  describe("#normalize", () => {
    // TODO
  });

  describe("#rotate", () => {
    // TODO
  });

  describe("#add", () => {
    it("should add each component", () => {
      const vec = new Vec2(3, 5);

      expect(vec.add({ x: 1, y: -2 })).toEqual({ x: 4, y: 3 });
    });
  });

  describe("#addScalar", () => {
    it("should add the given scalar to each component", () => {
      const vec = new Vec2(3, 5);

      expect(vec.addScalar(1)).toEqual({ x: 4, y: 6 });
      expect(vec.addScalar(-2)).toEqual({ x: 2, y: 4 });
    });
  });

  describe("#subtract", () => {
    // TODO
  });

  describe("#subtractScalar", () => {
    // TODO
  });

  describe("#multiply", () => {
    // TODO
  });

  describe("#multiplyScalar", () => {
    // TODO
  });

  describe("#divide", () => {
    // TODO
  });

  describe("#divideScalar", () => {
    // TODO
  });

  describe("#negate", () => {
    // TODO
  });

  describe("#abs", () => {
    // TODO
  });

  describe("#equals", () => {
    // TODO
  });

  describe("#copy", () => {
    // TODO
  });

  describe("#clone", () => {
    // TODO
  });

  describe("#toString", () => {
    // TODO
  });
});
