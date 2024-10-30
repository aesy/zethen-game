import { describe, expect, it } from "vitest";
import { Rect } from "@/engine/math/rect";
import { Pnt2 } from "@/engine/math/pnt2";
import { Circle } from "@/engine/math/circle";

describe("Rect", () => {
  const rect = new Rect(3, 5, 10, 12);

  describe("#center", () => {
    it("should return the center coordinate", () => {
      expect(rect.center).toEqual({ x: 8, y: 11 });
    });
  });

  describe("#left", () => {
    it("should return the left side x coordinate", () => {
      expect(rect.left).toEqual(3);
    });
  });

  describe("#right", () => {
    it("should return the right side x coordinate", () => {
      expect(rect.right).toEqual(13);
    });
  });

  describe("#top", () => {
    it("should return the top side y coordinate", () => {
      expect(rect.top).toEqual(5);
    });
  });

  describe("#bottom", () => {
    it("should return the bottom side y coordinate", () => {
      expect(rect.bottom).toEqual(17);
    });
  });

  describe("#topLeft", () => {
    it("should return the top left corner coordinate", () => {
      expect(rect.topLeft).toEqual({ x: 3, y: 5 });
    });
  });

  describe("#topRight", () => {
    it("should return the top right corner coordinate", () => {
      expect(rect.topRight).toEqual({ x: 13, y: 5 });
    });
  });

  describe("#bottomLeft", () => {
    it("should return the bottom left corner coordinate", () => {
      expect(rect.bottomLeft).toEqual({ x: 3, y: 17 });
    });
  });

  describe("#bottomRight", () => {
    it("should return the bottom right corner coordinate", () => {
      expect(rect.bottomRight).toEqual({ x: 13, y: 17 });
    });
  });

  describe("#getClosestPoint", () => {
    it("should return the closest point on the rect edge when given a point outside the rect", () => {
      expect(rect.getClosestPoint({ x: 2, y: 4 })).toEqual(new Pnt2(3, 5));
      expect(rect.getClosestPoint({ x: 4, y: 4 })).toEqual(new Pnt2(4, 5));
      expect(rect.getClosestPoint({ x: 14, y: 6 })).toEqual(new Pnt2(13, 6));
      expect(rect.getClosestPoint({ x: 8, y: 20 })).toEqual(new Pnt2(8, 17));
    });

    it("should return the closest point on the rect edge when given a point inside the rect", () => {
      expect(rect.getClosestPoint({ x: 4, y: 6 })).toEqual(new Pnt2(3, 5));
      // expect(rect.getClosestPoint({ x: 4, y: 7 })).toEqual(new Pnt2(3, 7));
      // expect(rect.getClosestPoint({ x: 12, y: 15 })).toEqual(new Pnt2(13, 15));
      // expect(rect.getClosestPoint({ x: 10, y: 16 })).toEqual(new Pnt2(10, 17));
    });

    it("should return the same point if the given point is at an edge", () => {
      expect(rect.getClosestPoint({ x: 3, y: 5 })).toEqual(new Pnt2(3, 5));
      // expect(rect.getClosestPoint({ x: 4, y: 5 })).toEqual(new Pnt2(4, 5));
      // expect(rect.getClosestPoint({ x: 3, y: 6 })).toEqual(new Pnt2(3, 6));
    });

    it("should prioritize top-left over bottom-right if multiple edges are equally close", () => {
      expect(
        new Rect(2, 2, 2, 2).getClosestPoint({
          x: 3,
          y: 3,
        }),
      ).toEqual({ x: 2, y: 2 });
    });
  });

  describe("#containsPoint", () => {
    it("should return true when given point is inside rect", () => {
      expect(rect.containsPoint({ x: 4, y: 6 })).toEqual(true);
    });

    it("should return false when given point is outside rect", () => {
      expect(rect.containsPoint({ x: 2, y: 6 })).toEqual(false);
    });

    it("should return true when given point is at the edge of rect", () => {
      expect(rect.containsPoint({ x: 3, y: 5 })).toEqual(true);
      expect(rect.containsPoint({ x: 4, y: 5 })).toEqual(true);
    });
  });

  describe("#containsRect", () => {
    it("should return true if the given rect is inside", () => {
      expect(rect.containsRect(new Rect(4, 6, 8, 10))).toEqual(true);
    });

    it("should return true if the given rect is outside", () => {
      expect(rect.containsRect(new Rect(0, 1, 2, 3))).toEqual(false);
    });

    it("should return false when given rect is overlapping", () => {
      expect(rect.containsRect(new Rect(1, 2, 4, 7))).toEqual(false);
    });

    it("should return false when given rect is surrounding", () => {
      expect(rect.containsRect(new Rect(0, 0, 12, 14))).toEqual(false);
    });

    it("should return true when given itself", () => {
      expect(rect.containsRect(rect)).toEqual(true);
    });
  });

  describe("#containsCircle", () => {
    it("should return true if the given circle is inside", () => {
      expect(
        rect.containsCircle(new Circle(rect.center.x, rect.center.y, 2)),
      ).toEqual(true);
    });

    it("should return false if the given circle is outside", () => {
      expect(rect.containsCircle(new Circle(20, 24, 2))).toEqual(false);
      expect(rect.containsCircle(new Circle(0, 0, 3))).toEqual(false);
    });

    it("should return false if the given circle is overlapping", () => {
      expect(rect.containsCircle(new Circle(rect.left, rect.top, 2))).toEqual(
        false,
      );
    });

    it("should return false when given circle is surrounding", () => {
      expect(
        rect.containsCircle(new Circle(rect.center.x, rect.center.y, 15)),
      ).toEqual(false);
    });
  });

  describe("#overlapsRect", () => {
    it("should return true if the given rect is inside", () => {
      expect(rect.overlapsRect(new Rect(4, 6, 8, 10))).toEqual(true);
    });

    it("should return false if the given rect is outside", () => {
      expect(rect.overlapsRect(new Rect(0, 1, 2, 3))).toEqual(false);
    });

    it("should return true if the given rect is overlapping", () => {
      expect(rect.overlapsRect(new Rect(1, 2, 4, 7))).toEqual(true);
    });

    it("should return true when given rect is surrounding", () => {
      expect(rect.overlapsRect(new Rect(0, 0, 12, 14))).toEqual(true);
    });

    it("should return true when used on itself", () => {
      expect(rect.overlapsRect(rect)).toEqual(true);
    });
  });

  describe("#overlapsCircle", () => {
    it("should return true if the given circle is inside", () => {
      expect(
        rect.overlapsCircle(new Circle(rect.center.x, rect.center.y, 2)),
      ).toEqual(true);
    });

    it("should return false if the given circle is outside", () => {
      expect(rect.overlapsCircle(new Circle(25, 25, 2))).toEqual(false);
      expect(rect.overlapsCircle(new Circle(0, 0, 3))).toEqual(false);
    });

    it("should return true if the given circle is overlapping", () => {
      expect(rect.overlapsCircle(new Circle(rect.left, rect.top, 2))).toEqual(
        true,
      );
    });

    it("should return true when given circle is surrounding", () => {
      expect(
        rect.overlapsCircle(new Circle(rect.center.x, rect.center.y, 15)),
      ).toEqual(true);
    });
  });

  describe("#getIntersectionRect", () => {
    it("should return a rect representing the intersection between the two rects", () => {
      expect(rect.intersectRect(new Rect(0, 0, 5, 6))).toEqual(
        new Rect(3, 5, 2, 1),
      );
      expect(rect.intersectRect(new Rect(4, 2, 3, 18))).toEqual(
        new Rect(4, 5, 3, 12),
      );
    });

    it("should return an identical rect if intersecting with itself", () => {
      expect(rect.intersectRect(rect)).toEqual(rect);
    });

    it("should return null if the given rect does not intersect", () => {
      expect(rect.intersectRect(new Rect(0, 1, 2, 3))).toBeNull();
    });
  });
});
