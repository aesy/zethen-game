import { describe, expect, it } from "vitest";
import { Pnt2 } from "@/engine/math/pnt2";
import { Query } from "@/engine/entity/query";
import { EntityManager } from "@/engine/entity/manager";
import { Transform2D } from "@/engine/component/transform2D";
import { Physical } from "@/engine/component/physical";
import { Archetype } from "@/engine/archetype";

describe("EntityManager", () => {
  describe("#createEntity", () => {
    it("should be able to create an entity without any components", () => {
      const em = new EntityManager();
      const id1 = em.createEntity();
      const id2 = em.createEntity();
      em.createEntity();

      expect(id1).not.toEqual(id2);
    });

    it("should be able to create an entity with components", () => {
      const em = new EntityManager();
      const id1 = em.createEntity([new Transform2D(Pnt2.ORIGIN.clone())]);
      const id2 = em.createEntity([
        new Transform2D(Pnt2.ORIGIN.clone()),
        new Physical(1),
      ]);
      em.createEntity();

      expect(id1).not.toEqual(id2);
      expect(em.getAllComponents(id1)).toHaveLength(1);
      expect(em.getAllComponents(id2, Transform2D)).toHaveLength(1);
    });
  });

  describe("#createArchetype", () => {
    it("should create an entity with predefined components using an archetype", () => {
      const MyArchetype = Archetype.builder()
        .single("transform", Transform2D)
        .optional("physical", Physical)
        .build();
      const em = new EntityManager();
      const id1 = em.createArchetype(MyArchetype, {
        transform: new Transform2D(Pnt2.ORIGIN.clone()),
      });
      const id2 = em.createArchetype(MyArchetype, {
        transform: new Transform2D(Pnt2.ORIGIN.clone()),
        physical: new Physical(0),
      });

      expect(id1).not.toEqual(id2);
    });
  });

  describe("#deleteEntity", () => {
    it("should delete an entity", () => {
      const em = new EntityManager();
      const id = em.createEntity([new Transform2D(Pnt2.ORIGIN.clone())]);

      em.deleteEntity(id);

      expect(em.queryAllEntities(Query.ALL)).toHaveLength(0);
    });
  });

  describe("#addComponent", () => {
    it("should add a component to an entity", () => {
      const em = new EntityManager();
      const id = em.createEntity();
      em.createEntity();

      em.addComponent(id, new Transform2D(Pnt2.ORIGIN.clone()));

      expect(em.getAllComponents(id, Transform2D)).toHaveLength(1);
    });
  });

  describe("#removeComponent", () => {
    it("should remove a component from an entity", () => {
      const em = new EntityManager();
      const transform = new Transform2D(Pnt2.ORIGIN.clone());
      const id = em.createEntity([transform]);
      em.createEntity();

      em.removeComponent(id, transform);

      expect(em.getAllComponents(id, Transform2D)).toHaveLength(0);
    });

    it("should do nothing when trying to remove a component that does not exist", () => {
      const em = new EntityManager();
      const transform = new Transform2D(Pnt2.ORIGIN.clone());
      const id = em.createEntity();
      em.createEntity();

      em.removeComponent(id, transform);

      expect(em.getAllComponents(id)).toHaveLength(0);
    });
  });

  describe("#getFirstComponent", () => {
    it("should return the first component added to an entity", () => {
      const em = new EntityManager();
      const transform1 = new Transform2D(Pnt2.ORIGIN.clone());
      const transform2 = new Transform2D(Pnt2.ORIGIN.clone());
      const id = em.createEntity([transform1, transform2]);
      em.createEntity();

      expect(em.getFirstComponent(id, Transform2D)).toEqual(transform1);
    });
  });

  describe("#getAllComponents", () => {
    it("should be able to return all components added of an entity", () => {
      const em = new EntityManager();
      em.createEntity();
      const id = em.createEntity([
        new Physical(0),
        new Transform2D(Pnt2.ORIGIN.clone()),
        new Transform2D(Pnt2.ORIGIN.clone()),
      ]);
      em.createEntity([new Physical(0), new Transform2D(Pnt2.ORIGIN.clone())]);

      expect(em.getAllComponents(id)).toHaveLength(3);
    });

    it("should be able to return all components of a specific type added to an entity", () => {
      const em = new EntityManager();
      em.createEntity();
      const id = em.createEntity([
        new Physical(0),
        new Transform2D(Pnt2.ORIGIN.clone()),
        new Transform2D(Pnt2.ORIGIN.clone()),
      ]);
      em.createEntity([new Physical(0), new Transform2D(Pnt2.ORIGIN.clone())]);

      expect(em.getAllComponents(id, Transform2D)).toHaveLength(2);
    });
  });

  describe("#queryFirstEntity", () => {
    it("should return the first component of an entity matching the given query", () => {
      const em = new EntityManager();
      const transform = new Transform2D(Pnt2.ORIGIN.clone());
      const id = em.createEntity([transform, new Physical(0)]);
      em.createEntity();

      const entity = em.queryFirstEntity(
        Query.create()
          .single("transform", Transform2D)
          .optional("physical", Physical),
      );

      expect(entity).not.toBeNull();
      expect(entity!.id).toEqual(id);
      expect(entity!.transform).toEqual(transform);
    });

    it("should return the same result when called twice", () => {
      const em = new EntityManager();
      const id = em.createEntity([
        new Transform2D(Pnt2.ORIGIN.clone()),
        new Physical(0),
      ]);
      em.createEntity();

      const entity1 = em.queryFirstEntity(
        Query.create()
          .single("transform", Transform2D)
          .optional("physical", Physical),
      );
      const entity2 = em.queryFirstEntity(
        Query.create()
          .single("transform", Transform2D)
          .optional("physical", Physical),
      );

      expect(entity1?.id).toEqual(id);
      expect(entity2?.id).toEqual(id);
    });

    it("should not return an entity if not matching a query after a mandatory component was removed", () => {
      const em = new EntityManager();
      const transform = new Transform2D(Pnt2.ORIGIN.clone());
      const id = em.createEntity([transform, new Physical(0)]);
      em.createEntity();

      em.removeComponent(id, transform);

      const entity = em.queryFirstEntity(
        Query.create()
          .single("transform", Transform2D)
          .optional("physical", Physical),
      );

      expect(entity).toBeNull();
    });

    it("should return an entity if matching a query after a mandatory component was added", () => {
      const em = new EntityManager();
      const id = em.createEntity([new Physical(0)]);
      em.createEntity();

      em.addComponent(id, new Transform2D(Pnt2.ORIGIN.clone()));

      const entity = em.queryFirstEntity(
        Query.create()
          .single("transform", Transform2D)
          .optional("physical", Physical),
      );

      expect(entity).not.toBeNull();
    });
  });

  describe("#queryAllEntities", () => {
    it("should return all components of an entity matching the given query", () => {
      const em = new EntityManager();
      const id1 = em.createEntity([
        new Transform2D(Pnt2.ORIGIN.clone()),
        new Physical(0),
      ]);
      const id2 = em.createEntity([new Transform2D(Pnt2.ORIGIN.clone())]);
      em.createEntity();

      const entities = em.queryAllEntities(
        Query.create()
          .single("transform", Transform2D)
          .optional("physical", Physical),
      );

      expect(entities).toHaveLength(2);
      expect(entities[0].id).toEqual(id1);
      expect(entities[1].id).toEqual(id2);
    });

    it("should return the same result when called twice", () => {
      const em = new EntityManager();
      em.createEntity();
      const id = em.createEntity([
        new Transform2D(Pnt2.ORIGIN.clone()),
        new Physical(0),
      ]);
      em.createEntity();

      const entities1 = em.queryAllEntities(
        Query.create()
          .single("transform", Transform2D)
          .optional("physical", Physical),
      );
      const entities2 = em.queryAllEntities(
        Query.create()
          .single("transform", Transform2D)
          .optional("physical", Physical),
      );

      expect(entities1[0].id).toEqual(id);
      expect(entities2[0].id).toEqual(id);
    });
  });

  describe("#queryAllEntities", () => {
    it("should query entities by component", () => {
      const em = new EntityManager();
      em.createEntity([new Transform2D(Pnt2.ORIGIN.clone())]);
      em.createEntity([new Transform2D(Pnt2.ORIGIN.clone()), new Physical(1)]);
      em.createEntity();

      const entities = em.queryAllEntities(
        Query.create().single("transform", Transform2D),
      );

      expect(entities).toHaveLength(2);
      expect(entities[0].transform).not.toBeNull();
      expect(entities[1].transform).not.toBeNull();
      expect(entities[0].id).not.toEqual(entities[1].id);
    });

    it("should  query entities by components", () => {
      const em = new EntityManager();
      em.createEntity([new Transform2D(Pnt2.ORIGIN.clone())]);
      em.createEntity([new Transform2D(Pnt2.ORIGIN.clone()), new Physical(1)]);
      em.createEntity();

      const entities = em.queryAllEntities(
        Query.create()
          .single("transform", Transform2D)
          .single("physical", Physical),
      );

      expect(entities).toHaveLength(1);
      expect(entities[0].transform).not.toBeNull();
      expect(entities[0].physical).not.toBeNull();
    });

    it("should query all entities", () => {
      const em = new EntityManager();
      em.createEntity([new Transform2D(Pnt2.ORIGIN.clone())]);
      em.createEntity([new Transform2D(Pnt2.ORIGIN.clone()), new Physical(1)]);
      em.createEntity();

      const entities = em.queryAllEntities(Query.ALL);

      expect(entities).toHaveLength(3);
    });
  });
});
