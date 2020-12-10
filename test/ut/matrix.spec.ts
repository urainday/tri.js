/**
 * @file matrix.test.js
 */

import {
    identity,
    copy,
    clone,
    invert,
    scale, translate, skew, rotate, multiply, Matrix
} from '../../src/core/matrix';
import {Vec2} from "../../src/core/vector";

let out: Matrix;
beforeEach(() => {
    out = identity();
})

test('identity', () => {
    const m = identity();
    expect(m).toEqual([1, 0, 0, 1, 0, 0]);
});

test('copy', () => {
    const m: Matrix = [2, 0, 0, 2, 0, 0];
    const result = copy(out, m)
    expect(out).toEqual(m);
    expect(result).toBe(out);
})

test('clone ', () => {
    const m: Matrix = [2, 0, 0, 2, 0, 0];
    const out = clone(m);
    expect(out).not.toBe(m);
    expect(out).toEqual(m);
});

describe('invert', () => {
    test('invert - 1', () => {
        const m: Matrix = [1, 4, 2, 5, 3, 6];
        const inv: Matrix = [-5 / 3, 4 / 3, 2 / 3, -1 / 3, 1, -2];
        const result = invert(out, m);
        expect(out).toEqual(inv);
        expect(result).toBe(out);
        expect(m).toEqual([1, 4, 2, 5, 3, 6]);
    });

    test('invert - 2', () => {
        const m: Matrix = [1, 4, 2, 5, 3, 6];
        const inv: Matrix = [-5 / 3, 4 / 3, 2 / 3, -1 / 3, 1, -2];
        const result = invert(m, m);
        expect(m).toEqual(inv);
        expect(result).toBe(m);
    });
})

test('invert - not invertible', () => {
    const m: Matrix = [1, 1, 1, 1, 0, 0];
    expect(() => {
        invert(out, m);
    }).toThrow();
    expect(m).toEqual([1, 1, 1, 1, 0, 0]);
});

test('scale', () => {
    const v: Vec2 = [20, 40];
    const m = identity();
    const result = scale(out, m, v);
    expect(out).toEqual([20, 0, 0, 40, 0, 0]);
    expect(result).toBe(out);
});

describe('skew', () => {
    test('skew - 1', () => {
        const DEGREE_TO_RADIAN = Math.PI / 180;
        const precision = 0.000001;
        const v: Vec2 = [45 * DEGREE_TO_RADIAN, 180 * DEGREE_TO_RADIAN];
        const m: Matrix = [5, 10, 15, 20, 25, 30];
        const result = skew(out, m, v);
        expect(Math.abs(out[0] - 15)).toBeLessThanOrEqual(precision);
        expect(Math.abs(out[1] - 10)).toBeLessThanOrEqual(precision);
        expect(Math.abs(out[2] - 35)).toBeLessThanOrEqual(precision);
        expect(Math.abs(out[3] - 20)).toBeLessThanOrEqual(precision);
        expect(Math.abs(out[4] - 55)).toBeLessThanOrEqual(precision);
        expect(Math.abs(out[5] - 30)).toBeLessThanOrEqual(precision);
        expect(result).toBe(out);
    });

    test('skew - 2', () => {
        const DEGREE_TO_RADIAN = Math.PI / 180;
        const precision = 0.000001;
        const v: Vec2 = [45 * DEGREE_TO_RADIAN, 180 * DEGREE_TO_RADIAN];
        const m: Matrix = [5, 10, 15, 20, 25, 30];
        const result = skew(m, m, v);
        expect(Math.abs(m[0] - 15)).toBeLessThanOrEqual(precision);
        expect(Math.abs(m[1] - 10)).toBeLessThanOrEqual(precision);
        expect(Math.abs(m[2] - 35)).toBeLessThanOrEqual(precision);
        expect(Math.abs(m[3] - 20)).toBeLessThanOrEqual(precision);
        expect(Math.abs(m[4] - 55)).toBeLessThanOrEqual(precision);
        expect(Math.abs(m[5] - 30)).toBeLessThanOrEqual(precision);
    });
});


test('translate', () => {
    const v: Vec2 = [40, 60];
    const m = identity();
    const result = translate(out, m, v);
    expect(out).toEqual([1, 0, 0, 1, 40, 60]);
    expect(result).toBe(out);
});

describe('rotate', () => {
    test('rotate - 1', () => {
        const DEGREE_TO_RADIAN = Math.PI / 180;
        const precision = 0.000001;
        const angle = 90 * DEGREE_TO_RADIAN;
        const m = identity();
        const result = rotate(out, m, angle);
        expect(Math.abs(out[0])).toBeLessThanOrEqual(precision);
        expect(Math.abs(out[1] - (-1))).toBeLessThanOrEqual(precision);
        expect(Math.abs(out[2] - 1)).toBeLessThanOrEqual(precision);
        expect(Math.abs(out[3])).toBeLessThanOrEqual(precision);
        expect(Math.abs(out[4])).toBeLessThanOrEqual(precision);
        expect(Math.abs(out[5])).toBeLessThanOrEqual(precision);
        expect(result).toBe(out);
    });

    test('rotate - 2', () => {
        const DEGREE_TO_RADIAN = Math.PI / 180;
        const precision = 0.000001;
        const angle = 90 * DEGREE_TO_RADIAN;
        const m = identity();
        const result = rotate(m, m, angle);
        expect(result).toBe(m);
        expect(Math.abs(m[0])).toBeLessThanOrEqual(precision);
        expect(Math.abs(m[1] - (-1))).toBeLessThanOrEqual(precision);
        expect(Math.abs(m[2] - 1)).toBeLessThanOrEqual(precision);
        expect(Math.abs(m[3])).toBeLessThanOrEqual(precision);
        expect(Math.abs(m[4])).toBeLessThanOrEqual(precision);
        expect(Math.abs(m[5])).toBeLessThanOrEqual(precision);
    });
});

test('mutiply', () => {
    const m1: Matrix = [1, 0, 0, 1, 40, 40];
    const m2: Matrix = [2, 0, 0, 2, 0, 0];
    const m12: Matrix = [2, 0, 0, 2, 40, 40];
    const result = multiply(out, m1, m2);
    expect(out).toEqual(m12);
    expect(result).toBe(out);
    expect(m1).toEqual([1, 0, 0, 1, 40, 40]);
    expect(m2).toEqual([2, 0, 0, 2, 0, 0]);
});
