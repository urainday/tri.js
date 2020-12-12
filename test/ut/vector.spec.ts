/**
 * @file vector.test.js
 */

import {
    clone,
    copy,
    create,
    distance,
    squaredDistance,
    add,
    sub,
    mul,
    div,
    scale,
    normalize,
    min,
    max,
    applyTransform,
    Vec2,
    linearInterpolation
} from '../../src/core/vector';
import {
    identity,
    scale as mScale,
    rotate as mRotate,
    skew as mSkew,
    translate as mTranslate, Matrix
} from '../../src/core/matrix';

const precision = 0.000001;
const DEGREE_TO_RADIAN = Math.PI / 180;
let out: Vec2;
let v1: Vec2;
let v2: Vec2;

beforeEach(() => {
    out = create();
    v1 = [1, 2];
    v2 = [3, 4];
});

describe('create', () => {
    test('without arguments', () => {
        const result = create();
        expect(result).toEqual([0, 0]);
    });

    test('with arguments', () => {
        const result = create(1, 2);
        expect(result).toEqual([1, 2]);
    });
});

test('copy', () => {
    const result = copy(out, v1);
    expect(out).toEqual(v1);
    expect(result).toBe(out);
});

test('clone', () => {
    const result = clone(v1);
    expect(result).toEqual(v1);
    expect(result).not.toBe(v1);
});

test('distance', () => {
    const result = distance(v1, v2);
    expect(Math.abs(result - 2.828427)).toBeLessThanOrEqual(precision);
});

test('squaredDistance', () => {
    const result = squaredDistance(v1, v2);
    expect(result).toBe(8);
});

describe('linearInterpolation', () => {
    test('t is 0', () => {
        const result = linearInterpolation(out, v1, v2, 0);
        expect(out).toEqual(v1);
        expect(result).toBe(out);
        expect(v1).toEqual([1, 2]);
        expect(v2).toEqual([3, 4]);
    });

    test('t is 1', () => {
        const result = linearInterpolation(out, v1, v2, 1);
        expect(out).toEqual(v2);
        expect(result).toBe(out);
        expect(v1).toEqual([1, 2]);
        expect(v2).toEqual([3, 4]);
    });

    test('t is 0.4', () => {
        const result = linearInterpolation(out, v1, v2, 0.4);
        expect(Math.abs(out[0] - 1.8)).toBeLessThanOrEqual(precision);
        expect(Math.abs(out[1] - 2.8)).toBeLessThanOrEqual(precision);
        expect(result).toBe(out);
        expect(v1).toEqual([1, 2]);
        expect(v2).toEqual([3, 4]);
    });

    test('t is out of range', () => {
        expect(() => {
            linearInterpolation(out, v1, v2, -1);
        }).toThrow();
        expect(() => {
            linearInterpolation(out, v1, v2, 2);
        }).toThrow();
    });

    test('out is v1', () => {
        const result = linearInterpolation(v1, v1, v2, 0.4);
        expect(Math.abs(v1[0] - 1.8)).toBeLessThanOrEqual(precision);
        expect(Math.abs(v1[1] - 2.8)).toBeLessThanOrEqual(precision);
        expect(result).toBe(v1);
        expect(v2).toEqual([3, 4]);
    });

    test('out is v2', () => {
        const result = linearInterpolation(v2, v1, v2, 0.4);
        expect(Math.abs(v2[0] - 1.8)).toBeLessThanOrEqual(precision);
        expect(Math.abs(v2[1] - 2.8)).toBeLessThanOrEqual(precision);
        expect(result).toBe(v2);
        expect(v1).toEqual([1, 2]);
    });
});

describe('add', () => {
    test('with a separate output vector', () => {
        const result = add(out, v1, v2);
        expect(out).toEqual([4, 6]);
        expect(result).toBe(out);
        expect(v1).toEqual([1, 2]);
        expect(v2).toEqual([3, 4]);
    });
    test('when v1 is the output vector', () => {
        const result = add(v1, v1, v2);
        expect(v1).toEqual([4, 6]);
        expect(result).toBe(v1);
        expect(v2).toEqual([3, 4]);
    });
    test('when v2 is the output vector', () => {
        const result = add(v2, v1, v2);
        expect(v2).toEqual([4, 6]);
        expect(result).toBe(v2);
        expect(v1).toEqual([1, 2]);
    });
});

describe('sub', () => {
    test('with a separate output vector', () => {
        const result = sub(out, v1, v2);
        expect(out).toEqual([-2, -2]);
        expect(result).toBe(out);
        expect(v1).toEqual([1, 2]);
        expect(v2).toEqual([3, 4]);
    });
    test('when v1 is the output vector', () => {
        const result = sub(v1, v1, v2);
        expect(v1).toEqual([-2, -2]);
        expect(result).toBe(v1);
        expect(v2).toEqual([3, 4]);
    });
    test('when v2 is the output vector', () => {
        const result = sub(v2, v1, v2);
        expect(v2).toEqual([-2, -2]);
        expect(result).toBe(v2);
        expect(v1).toEqual([1, 2]);
    });
});

describe('mul', () => {
    test('with a separate output vector', () => {
        const result = mul(out, v1, v2);
        expect(out).toEqual([3, 8]);
        expect(result).toBe(out);
        expect(v1).toEqual([1, 2]);
        expect(v2).toEqual([3, 4]);
    });
    test('when v1 is the output vector', () => {
        const result = mul(v1, v1, v2);
        expect(v1).toEqual([3, 8]);
        expect(result).toBe(v1);
        expect(v2).toEqual([3, 4]);
    });
    test('when v2 is the output vector', () => {
        const result = mul(v2, v1, v2);
        expect(v2).toEqual([3, 8]);
        expect(result).toBe(v2);
        expect(v1).toEqual([1, 2]);
    });
});

describe('div', () => {
    test('with a separate output vector', () => {
        const result = div(out, v1, v2);
        expect(Math.abs(out[0] - 0.333333)).toBeLessThanOrEqual(precision);
        expect(out[1]).toBe(0.5);
        expect(result).toBe(out);
        expect(v1).toEqual([1, 2]);
        expect(v2).toEqual([3, 4]);
    });
    test('when v1 is the output vector', () => {
        const result = div(v1, v1, v2);
        expect(Math.abs(v1[0] - 0.333333)).toBeLessThanOrEqual(precision);
        expect(v1[1]).toBe(0.5);
        expect(result).toBe(v1);
        expect(v2).toEqual([3, 4]);
    });
    test('when v2 is the output vector', () => {
        const result = div(v2, v1, v2);
        expect(Math.abs(v2[0] - 0.333333)).toBeLessThanOrEqual(precision);
        expect(v2[1]).toBe(0.5);
        expect(result).toBe(v2);
        expect(v1).toEqual([1, 2]);
    });

    test('when v2 is 0', () => {
        const v2: Vec2 = [0, 0];
        expect(() => {
            div(v1, v1, v2);
        }).toThrow();
    })
});

describe('scale', function() {
    test('with a separate output vector', function() {
        const result = scale(out, v1, 2);
        expect(out).toEqual([2, 4]);
        expect(result).toBe(out);
        expect(v1).toEqual([1, 2]);
    });

    test('when v1 is the output vector', function() {
        const result = scale(v1, v1, 2);
        expect(v1).toEqual([2, 4]);
        expect(result).toBe(v1);
    });
});

describe('normalize', function() {
    beforeEach(() => {
        v1 = [5, 0];
    });

    test('zero vector', () => {
        v1 = [0, 0];
        const result = normalize(out, v1);
        expect(out).toEqual([0, 0]);
        expect(result).toBe(out);
        expect(v1).toEqual([0, 0]);
    });

    test('with a separate output vector', function() {
        const result = normalize(out, v1);
        expect(out).toEqual([1, 0]);
        expect(result).toBe(out);
        expect(v1).toEqual([5, 0]);
    });

    test('when v1 is the output vector', function() {
        const result = normalize(v1, v1);
        expect(v1).toEqual([1, 0]);
        expect(result).toBe(v1);
    });
});

describe('applyTransform', () => {
    test('apply identity transform', () => {
        const m = identity();
        const result = applyTransform(out, v1, m);
        expect(out).toEqual(v1);
        expect(result).toBe(out);
        expect(v1).toEqual([1, 2]);
    });

    test('apply scale transform', () => {
        const m = identity();
        mScale(m, m, [2, 3]);
        const result = applyTransform(out, v1, m);
        expect(out).toEqual([2, 6]);
        expect(result).toBe(out);
        expect(v1).toEqual([1, 2]);
    });

    test('apply rotate transform', () => {
        const m = identity();
        mRotate(m, m, 90 * DEGREE_TO_RADIAN);
        const result = applyTransform(out, v1, m);
        expect(out[0] - 2).toBeLessThanOrEqual(precision);
        expect(out[1] - (-1)).toBeLessThanOrEqual(precision);
        expect(result).toBe(out);
        expect(v1).toEqual([1, 2]);
    });

    test('apply skew transform', () => {
        v1 = [5, 4];
        const m = identity();
        mSkew(m, m, [10 * DEGREE_TO_RADIAN, 0]);
        const result = applyTransform(out, v1, m);
        expect(out[0] - 5.70530792283386).toBeLessThanOrEqual(precision);
        expect(out[1] - 4).toBeLessThanOrEqual(precision);
        expect(result).toBe(out);
        expect(v1).toEqual([5, 4]);
    });

    test('apply translate transform', () => {
        const m = identity();
        mTranslate(m, m, [1, 3]);
        const result = applyTransform(out, v1, m);
        expect(out).toEqual([2, 5]);
        expect(result).toBe(out);
        expect(v1).toEqual([1, 2]);
    });

    test('apply compose transform', () => {
        // trans(40,40) scale(2,2) trans(-40,-40)
        const m: Matrix = [2, 0, 0, 2, -40, -40];
        const v1: Vec2 = [30, 30];
        const result = applyTransform(out, v1, m);
        expect(out).toEqual([20, 20]);
        expect(result).toBe(out);
        expect(v1).toEqual([30, 30]);
    })
});

describe('min', function() {
    beforeEach(() => {
        v1 = [1, 4];
        v2 = [3, 2];
    });

    test('with a separate output vector', function() {
        const result = min(out, v1, v2);
        expect(out).toEqual([1, 2]);
        expect(result).toBe(out);
        expect(v1).toEqual([1, 4]);
        expect(v2).toEqual([3, 2]);
    });

    test('when v1 is the output vector', function() {
        const result = min(v1, v1, v2);
        expect(v1).toEqual([1, 2]);
        expect(result).toBe(v1);
        expect(v2).toEqual([3, 2]);
    });

    test('when v2 is the output vector', function() {
        const result = min(v2, v1, v2);
        expect(v2).toEqual([1, 2]);
        expect(result).toBe(v2);
        expect(v1).toEqual([1, 4]);
    });
});

describe('max', function() {
    beforeEach(() => {
        v1 = [1, 4];
        v2 = [3, 2];
    });

    test('with a separate output vector', function() {
        const result = max(out, v1, v2);
        expect(out).toEqual([3, 4]);
        expect(result).toBe(out);
        expect(v1).toEqual([1, 4]);
        expect(v2).toEqual([3, 2]);
    });

    test('when v1 is the output vector', function() {
        const result = max(v1, v1, v2);
        expect(v1).toEqual([3, 4]);
        expect(result).toBe(v1);
        expect(v2).toEqual([3, 2]);
    });

    test('when v2 is the output vector', function() {
        const result = max(v2, v1, v2);
        expect(v2).toEqual([3, 4]);
        expect(result).toBe(v2);
        expect(v1).toEqual([1, 4]);
    });
});
