/**
 * @file matrix.test.js
 */

import {
    identity,
    copy,
    clone,
    invert,
    scale, translate, skew, rotate, multiply
} from '../../src/core/matrix';

let out;
beforeEach(() => {
    out = identity();
})

test('identity', () => {
    const m = identity();
    expect(m).toEqual([1, 0, 0, 1, 0, 0]);
});

test('copy', () => {
    const m = [2, 0, 0, 2, 0, 0];
    const result = copy(out, m)
    expect(out).toEqual(m);
    expect(result).toBe(out);
})

test('clone ', () => {
    const m = [2, 0, 0, 2, 0, 0];
    const out = clone(m);
    expect(out).not.toBe(m);
    expect(out).toEqual(m);
});

test('invert', () => {
    const m = [1, 4, 2, 5, 3, 6];
    const inv = [-5 / 3, 4 / 3, 2 / 3, -1 / 3, 1, -2];
    const result = invert(out, m);
    expect(out).toEqual(inv);
    expect(result).toBe(out);
    expect(m).toEqual([1, 4, 2, 5, 3, 6]);
});

test('invert - not invertible', () => {
    const m = [1, 1, 1, 1, 0, 0];
    const result = invert(out, m);
    expect(result).toBe(null);
    expect(m).toEqual([1, 1, 1, 1, 0, 0]);
});

test('scale', () => {
    const v = [20, 40];
    const m = identity();
    const result = scale(out, m, v);
    expect(out).toEqual([20, 0, 0, 40, 0, 0]);
    expect(result).toBe(out);
});

test('skew', () => {
    const DEGREE_TO_RADIAN = Math.PI / 180;
    const precision = 0.000001;
    const v = [45 * DEGREE_TO_RADIAN, 180 * DEGREE_TO_RADIAN];
    const m = [5, 10, 15, 20, 25, 30];
    const result = skew(out, m, v);
    expect(Math.abs(out[0] - 15)).toBeLessThanOrEqual(precision);
    expect(Math.abs(out[1] - 10)).toBeLessThanOrEqual(precision);
    expect(Math.abs(out[2] - 35)).toBeLessThanOrEqual(precision);
    expect(Math.abs(out[3] - 20)).toBeLessThanOrEqual(precision);
    expect(Math.abs(out[4] - 55)).toBeLessThanOrEqual(precision);
    expect(Math.abs(out[5] - 30)).toBeLessThanOrEqual(precision);
    expect(result).toBe(out);
});

test('translate', () => {
    const v = [40, 60];
    const m = identity();
    const result = translate(out, m, v)
    expect(out).toEqual([1, 0, 0, 1, 40, 60]);
    expect(result).toBe(out);
});


test('rotate', () => {
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

test('mutiply', () => {
    const m1 = [1, 0, 0, 1, 40, 40];
    const m2 = [2, 0, 0, 2, 0, 0];
    const m12 = [2, 0, 0, 2, 40, 40];
    const result = multiply(out, m1, m2);
    expect(out).toEqual(m12);
    expect(result).toBe(out);
    expect(m1).toEqual([1, 0, 0, 1, 40, 40]);
    expect(m2).toEqual([2, 0, 0, 2, 0, 0]);
});
