/**
 * @file BoundingRect.test.js
 */
import BoundingRect, {Rect} from '../../src/core/BoundingRect';
import {
    translate as mTranslate,
    scale as mScale,
    rotate as mRotate,
    identity as mIdentity
} from '../../src/core/matrix'

let br: BoundingRect;
beforeEach(() => {
    br = BoundingRect.create({x: 1, y: 2, width: 3, height: 4});
});

test('static - create', () => {
    expect(br.x).toBe(1);
    expect(br.y).toBe(2);
    expect(br.width).toBe(3);
    expect(br.height).toBe(4);
});

describe('constructor', () => {
    test('width and height is positive', () => {
        expect(br.x).toBe(1);
        expect(br.y).toBe(2);
        expect(br.width).toBe(3);
        expect(br.height).toBe(4);
    });

    test('width and height is negative', () => {
        const br = BoundingRect.create({x: 1, y: 2, width: -3, height: -4});
        expect(br.x).toBe(-2);
        expect(br.y).toBe(-2);
        expect(br.width).toBe(3);
        expect(br.height).toBe(4);
    });
});

describe('applyTransform', () => {
    test('m - null', () => {
        br.applyTransform(null);
        expect(br.x).toBe(1);
        expect(br.y).toBe(2);
        expect(br.width).toBe(3);
        expect(br.height).toBe(4);
    });

    test('m - translate', () => {
        const m = mIdentity();
        mTranslate(m, m, [1, 1]);
        br.applyTransform(m);
        expect(br.x).toBe(2);
        expect(br.y).toBe(3);
        expect(br.width).toBe(3);
        expect(br.height).toBe(4);
    });

    test('m - scale', () => {
        const m = mIdentity();
        mScale(m, m, [2, 3]);
        br.applyTransform(m);
        expect(br.x).toBe(2);
        expect(br.y).toBe(6);
        expect(br.width).toBe(6);
        expect(br.height).toBe(12);
    });

    test('m - rotate', () => {
        const precision = 0.000001;
        const m = mIdentity();
        const br = BoundingRect.create({x: 0, y: 0, width: 2, height: 1});
        mRotate(m, m, (90 * Math.PI) / 180);
        br.applyTransform(m);
        expect(br.x - 0).toBeLessThanOrEqual(precision);
        expect(br.y - (-2)).toBeLessThanOrEqual(precision);
        expect(Math.abs(br.width - 1)).toBeLessThanOrEqual(precision);
        expect(Math.abs(br.height - 2)).toBeLessThanOrEqual(precision);
    });
});

test('calculateTransform', () => {
    const br2 = BoundingRect.create({x: 2, y: 3, width: 6, height: 8});
    const m = br.calculateTransform(br2);
    expect(m).toEqual([2, 0, 0, 2, 0, -1]);
});

describe('union', () => {
    test('union - 1', () => {
        const br2 = BoundingRect.create({x: 2, y: 3, width: 4, height: 5});
        br.union(br2);
        expect(br.x).toBe(1);
        expect(br.y).toBe(2);
        expect(br.width).toBe(5);
        expect(br.height).toBe(6);
    });

    test('union - 2', () => {
        const br2 = BoundingRect.create({x: 0, y: 0, width: 4, height: 5});
        br.union(br2);
        expect(br.x).toBe(0);
        expect(br.y).toBe(0);
        expect(br.width).toBe(4);
        expect(br.height).toBe(5);
    });

    test('union - 3', () => {
        const br2 = BoundingRect.create({x: 10, y: 10, width: 4, height: 5});
        br.union(br2);
        expect(br.x).toBe(1);
        expect(br.y).toBe(2);
        expect(br.width).toBe(13);
        expect(br.height).toBe(13);
    });
});


describe('intersect', () => {
    test('intersect - 1', () => {
        const result = br.intersect(null);
        expect(result).toBeFalsy();
    });

    test('intersect - 2', () => {
        const br2 = BoundingRect.create({x: 2, y: 3, width: 4, height: 5});
        const result = br.intersect(br2);
        expect(result).toBeTruthy();
    });

    test('intersect - 3', () => {
        const br2 = BoundingRect.create({x: 0, y: 0, width: 4, height: 5});
        const result = br.intersect(br2);
        expect(result).toBeTruthy();
    });

    test('intersect - 4', () => {
        const br2 = BoundingRect.create({x: 10, y: 10, width: 4, height: 5});
        const result = br.intersect(br2);
        expect(result).toBeFalsy();
    });

    test('intersect - 5', () => {
        const rect: Rect = {x: 10, y: 10, width: 4, height: 5};
        const result = br.intersect(rect);
        expect(result).toBeFalsy();
    });
});

describe('contain', () => {
    test('contain - 1', () => {
        const result = br.contain(1, 0);
        expect(result).toBeFalsy();
    });

    test('contain - 2', () => {
        const result = br.contain(2, 3);
        expect(result).toBeTruthy();
    });

    test('contain - 3', () => {
        const result = br.contain(20, 30);
        expect(result).toBeFalsy();
    });
});

test('clone', () => {
    const br2 = br.clone();
    expect(br).not.toBe(br2);
    expect(br.x).toBe(br2.x);
    expect(br.y).toBe(br2.y);
    expect(br.width).toBe(br2.width);
    expect(br.height).toBe(br2.height);
});

test('copy', () => {
    const br2 = BoundingRect.create({x: 10, y: 10, width: 4, height: 5});
    br.copy(br2);
    expect(br).not.toBe(br2);
    expect(br.x).toBe(10);
    expect(br.y).toBe(10);
    expect(br.width).toBe(4);
    expect(br.height).toBe(5);
    expect(br2.x).toBe(10);
    expect(br2.y).toBe(10);
    expect(br2.width).toBe(4);
    expect(br2.height).toBe(5);
});

test('plain', () => {
    const plain = br.plain();
    expect(plain).toEqual({x: 1, y: 2, width: 3, height: 4});
});
