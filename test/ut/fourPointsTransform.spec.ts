/**
 * @file fourPointsTransform.spec.ts
 */
import buildTransformer from "../../src/core/fourPointsTransform";
import {create, Vec2} from "../../src/core/vector";

describe('fourPointsTransform', () => {
    test('scale transform', () => {
        const src = [0, 0, 10, 0, 10, 10, 0, 10];
        const dest = [0, 0, 5, 0, 5, 5, 0, 5];
        const transformer = buildTransformer(src, dest);
        const out: Vec2 = create();
        transformer(out, 5, 5);
        expect(out[0]).toEqual(2.5);
        expect(out[1]).toEqual(2.5);
    });

    test('translate transform', () => {
        const src = [0, 0, 10, 0, 10, 10, 0, 10];
        const dest = [10, 10, 20, 10, 20, 20, 10, 20];
        const transformer = buildTransformer(src, dest);
        const out: Vec2 = create();
        transformer(out, 5, 5);
        expect(out[0]).toEqual(15);
        expect(out[1]).toEqual(15);
    });

    test('skew transform', () => {
        const src = [0, 0, 10, 0, 10, 10, 0, 10];
        const dest = [0, 0, 10, 0, 20, 10, 10, 10];
        const transformer = buildTransformer(src, dest);
        const out: Vec2 = create();
        transformer(out, 5, 5);
        expect(out[0]).toEqual(10);
        expect(out[1]).toEqual(5);
    });

    test('rotate transform', () => {
        const src = [0, 0, 20, 0, 20, 10, 0, 10];
        const dest = [0, 0, 0, 20, -10, 20, -10, 0];
        const transformer = buildTransformer(src, dest);
        const out: Vec2 = create();
        transformer(out, 10, 5);
        expect(out[0]).toEqual(-5);
        expect(out[1]).toEqual(10);
    });
})
