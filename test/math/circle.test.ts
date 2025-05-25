import { describe, expect, it } from "vitest";
import { Rect } from "@/engine/math/rect";
import { Circle } from "@/engine/math/circle";

describe("Circle", () => {
  const circle = new Circle(3, 5, 4);

  describe("#center", () => {
    it("should return the center coordinate", () => {
      expect(circle.center).toEqual({ x: 3, y: 5 });
    });
  });

  describe("#radius", () => {
    it("should return the radius", () => {
      expect(circle.radius).toEqual(4);
    });
  });

  describe("#getClosestPoint", () => {
    it("should return the closest point on the circle edge when given a point outside the circle", () => {
      expect(circle.getClosestPoint({ x: -2, y: 5 })).toEqual({ x: -1, y: 5 });
      expect(circle.getClosestPoint({ x: 3, y: 0 })).toEqual({ x: 3, y: 1 });
      expect(circle.getClosestPoint({ x: 0, y: 0 })).toEqual({
        x: 0.9420169782898942,
        y: 1.5700282971498236,
      });
    });

    it("should return the closest point on the circle edge when given a point inside the circle", () => {
      expect(circle.getClosestPoint({ x: 0, y: 5 })).toEqual({ x: -1, y: 5 });
      expect(circle.getClosestPoint({ x: 3, y: 2 })).toEqual({ x: 3, y: 1 });
    });

    it("should return the same point if the given point is at an edge", () => {
      expect(circle.getClosestPoint({ x: -1, y: 5 })).toEqual({ x: -1, y: 5 });
      expect(circle.getClosestPoint({ x: 3, y: 1 })).toEqual({ x: 3, y: 1 });
    });

    it("should prioritize top edge given center coordinate", () => {
      expect(circle.getClosestPoint(circle)).toEqual({ x: 3, y: 5 });
    });
  });

  describe("#containsPoint", () => {
    it("should return true if the given point is inside", () => {
      expect(circle.containsPoint(circle)).toEqual(true);
      expect(circle.containsPoint({ x: 3, y: 2 })).toEqual(true);
    });

    it("should return false if the given point is outside", () => {
      expect(circle.containsPoint({ x: 0, y: 0 })).toEqual(false);
      expect(circle.containsPoint({ x: 3, y: 10 })).toEqual(false);
    });
  });

  describe("#containsRect", () => {
    it("should return true if the given rect is inside", () => {
      expect(
        circle.containsRect(Rect.from({ ...circle, width: 2, height: 2 })),
      ).toEqual(true);
    });

    it("should return false if the given rect is outside", () => {
      expect(circle.containsRect(new Rect(10, 10, 2, 2))).toEqual(false);
    });

    it("should return false if the given rect is overlapping", () => {
      expect(
        circle.containsRect(Rect.from({ ...circle, width: 2, height: 5 })),
      ).toEqual(false);
    });

    it("should return false when given rect is surrounding", () => {
      expect(circle.containsRect(circle.getBoundingRect())).toEqual(false);
    });
  });

  describe("#containsCircle", () => {
    it("should return true if the given circle is inside", () => {
      expect(circle.containsCircle(new Circle(circle.x, circle.y, 2))).toEqual(
        true,
      );
    });

    it("should return false if the given circle is outside", () => {
      expect(circle.containsCircle(new Circle(20, 25, 2))).toEqual(false);
      expect(circle.containsCircle(new Circle(-10, -10, 3))).toEqual(false);
    });

    it("should return false if the given circle is overlapping", () => {
      expect(circle.containsCircle(new Circle(-2, 5, 2))).toEqual(false);
      expect(circle.containsCircle(new Circle(-2, 2, 5))).toEqual(false);
    });

    it("should return false when given circle is surrounding", () => {
      expect(circle.containsCircle(new Circle(circle.x, circle.y, 15))).toEqual(
        false,
      );
    });

    it("should return true when given itself", () => {
      expect(circle.containsCircle(circle)).toEqual(true);
    });
  });

  describe("#overlapsRect", () => {
    it("should return true if the given rect is inside", () => {
      expect(
        circle.overlapsRect(Rect.from({ ...circle, width: 2, height: 2 })),
      ).toEqual(true);
    });

    it("should return false if the given rect is outside", () => {
      expect(circle.overlapsRect(new Rect(10, 10, 2, 2))).toEqual(false);
    });

    it("should return true if the given rect is overlapping", () => {
      expect(
        circle.overlapsRect(Rect.from({ ...circle, width: 2, height: 5 })),
      ).toEqual(true);
    });

    it("should return true when given rect is surrounding", () => {
      expect(circle.overlapsRect(circle.getBoundingRect())).toEqual(true);
    });
  });

  describe("#overlapsCircle", () => {
    it("should return true if the given circle is inside", () => {
      expect(circle.overlapsCircle(new Circle(circle.x, circle.y, 2))).toEqual(
        true,
      );
    });

    it("should return false if the given circle is outside", () => {
      expect(circle.overlapsCircle(new Circle(20, 25, 2))).toEqual(false);
      expect(circle.overlapsCircle(new Circle(-10, -10, 3))).toEqual(false);
    });

    it("should return true if the given circle is overlapping", () => {
      expect(circle.overlapsCircle(new Circle(-2, 5, 2))).toEqual(true);
      expect(circle.overlapsCircle(new Circle(-2, 2, 5))).toEqual(true);
    });

    it("should return true when given circle is surrounding", () => {
      expect(circle.overlapsCircle(new Circle(circle.x, circle.y, 15))).toEqual(
        true,
      );
    });

    it("should return true when given itself", () => {
      expect(circle.overlapsCircle(circle)).toEqual(true);
    });
  });

  describe("#getBoundingRect", () => {
    it("should return a rect exactly surrounding the circle", () => {
      expect(circle.getBoundingRect()).toEqual(new Rect(-1, 1, 8, 8));
    });
  });
});
