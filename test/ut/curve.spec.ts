/**
 * @file curve.spec.ts
 */
import {
    cubicAt, cubicDerivativeAt, cubicExtrema, cubicProjectAt, cubicRootAt, cubicSubdivide,
    quadraticAt,
    quadraticDerivativeAt,
    quadraticExtremum, quadraticProjectAt,
    quadraticRootAt,
    quadraticSubdivide
} from '../../src/core/curve';
import {create as vCreate, Vec2} from '../../src/core/vector';

// v0 = [1, 5]
// v1 = [3, 1]
// v2 = [7, 8]
// v(t) = (1-t)(1-t)[1, 5] - 2t(1-t)[3, 1] + tt[7,8];
//      = [2tt + 4t + 1, 11tt -8t + 5]
describe('quadratic at', () => {
    const v0: Vec2 = [1, 5];
    const v1: Vec2 = [3, 1];
    const v2: Vec2 = [7, 8];

    test('t is 0', () => {
        const result = quadraticAt(v0, v1, v2, 0);
        expect(result).toEqual(v0);
    });

    test('t is 1', () => {
        const result = quadraticAt(v0, v1, v2, 1);
        expect(result).toEqual(v2);
    });

    test('t is 0.25', () => {
        const result = quadraticAt(v0, v1, v2, 0.25);
        expect(result).toEqual([2.125, 3.6875]);
    });

    test('t is less than 0', () => {
        expect(() => {
            quadraticAt(v0, v1, v2, -0.25);
        }).toThrow();
    });

    test('t is larger than 1', () => {
        expect(() => {
            quadraticAt(v0, v1, v2, 1.1);
        }).toThrow();
    });
});

// v0 = [1, 5]
// v1 = [3, 1]
// v2 = [7, 8]
// v(t) = (1-t)(1-t)[1, 5] - 2t(1-t)[3, 1] + tt[7,8];
//      = [2tt + 4t + 1, 11tt -8t + 5]
// v´(t) = [4t + 4, 22t - 8]
describe('quadratic derivative at', () => {
    const v0: Vec2 = [1, 5];
    const v1: Vec2 = [3, 1];
    const v2: Vec2 = [7, 8];

    test('t is 0', () => {
        const result = quadraticDerivativeAt(v0, v1, v2, 0);
        expect(result).toEqual([4, -8]);
    });

    test('t is 1', () => {
        const result = quadraticDerivativeAt(v0, v1, v2, 1);
        expect(result).toEqual([8, 14]);
    });

    test('t is 0.25', () => {
        const result = quadraticDerivativeAt(v0, v1, v2, 0.25);
        expect(result).toEqual([5, -2.5]);
    });

    test('t is less than 0', () => {
        expect(() => {
            quadraticDerivativeAt(v0, v1, v2, -0.25);
        }).toThrow();
    });

    test('t is larger than 1', () => {
        expect(() => {
            quadraticDerivativeAt(v0, v1, v2, 1.1);
        }).toThrow();
    });
});

// p0 = 5
// p1 = 1
// p2 = 8
// v(t) = 11tt -8t + 5
describe('quadratic extremum', () => {
    test('p0, p1, p2 are equal', () => {
        const t = quadraticExtremum(5, 5, 5);
        expect(t).toBe(0.5);
    });

    test('normal case', () => {
        const precision = 0.000001;
        const t = quadraticExtremum(5, 1, 8);
        expect(Math.abs(t - 0.36363636)).toBeLessThanOrEqual(precision);
    });
});

describe('quadratic root at', () => {
    // p0 = 5
    // p1 = 1
    // p2 = 8
    // v(t) = 11tt -8t + 5
    test('two roots', () => {
        const out: Array<number> = [];
        const n = quadraticRootAt(5, 1, 8, 5, out);
        expect(n).toBe(2);
        expect(out[0]).toBe(8 / 11);
        expect(out[1]).toBe(0);
    });

    // p0 = 4
    // p1 = 3
    // p2 = 2
    // v(t) = -2t + 4
    test('one root', () => {
        const out: Array<number> = [];
        const n = quadraticRootAt(4, 3, 2, 3, out);
        expect(n).toBe(1);
        expect(out[0]).toBe(0.5);
    });

    // p0 = 4
    // p1 = 3
    // p2 = 2
    // v(t) = -2t + 4
    test('zero root', () => {
        const out: Array<number> = [];
        const n = quadraticRootAt(4, 3, 2, 5, out);
        expect(n).toBe(0);
    });
});

// v0 = [1, 5]
// v1 = [3, 1]
// v2 = [7, 8]
// v(t) = (1-t)(1-t)[1, 5] - 2t(1-t)[3, 1] + tt[7,8];
//      = [2tt + 4t + 1, 11tt -8t + 5]
test('quadratic sub divide', () => {
    const precision = 0.000001;
    const t = 0.4;
    const v0: Vec2 = [1, 5];
    const v1: Vec2 = [3, 1];
    const v2: Vec2 = [7, 8];
    const v01: Vec2 = [1.8, 3.4];
    const v12: Vec2 = [4.6, 3.8];
    const v012: Vec2 = [2.92, 3.56];
    const out: Array<Vec2> = [];
    quadraticSubdivide(v0, v1, v2, t, out);
    expect(v0).toEqual([1, 5]);
    expect(v1).toEqual([3, 1]);
    expect(v2).toEqual([7, 8]);
    expect(out[0]).toEqual(v0);
    expect(Math.abs(out[1][0] - v01[0])).toBeLessThanOrEqual(precision);
    expect(Math.abs(out[1][1] - v01[1])).toBeLessThanOrEqual(precision);
    expect(Math.abs(out[2][0] - v012[0])).toBeLessThanOrEqual(precision);
    expect(Math.abs(out[2][1] - v012[1])).toBeLessThanOrEqual(precision);
    expect(Math.abs(out[3][0] - v012[0])).toBeLessThanOrEqual(precision);
    expect(Math.abs(out[3][1] - v012[1])).toBeLessThanOrEqual(precision);
    expect(Math.abs(out[4][0] - v12[0])).toBeLessThanOrEqual(precision);
    expect(Math.abs(out[4][1] - v12[1])).toBeLessThanOrEqual(precision);
    expect(out[5]).toEqual(v2);
});

describe('quadratic project at', () => {
    // v0 = [0, 0]
    // v1 = [4, 6]
    // v2 = [8, 0]
    // v = [4, 9]
    // t = 0.5
    // squareD = 6
    test('case 1', () => {
        const precision = 0.01;
        const v0: Vec2 = [0, 0];
        const v1: Vec2 = [4, 6];
        const v2: Vec2 = [8, 0];
        const v: Vec2 = [4, 9];
        const pv = quadraticAt(v0, v1, v2, 0.5);
        const out: Vec2 = vCreate();
        const result = quadraticProjectAt(v0, v1, v2, v, out);
        expect(Math.abs(result - Math.sqrt(36))).toBeLessThanOrEqual(precision);
        expect(Math.abs(out[0] - pv[0])).toBeLessThanOrEqual(precision);
        expect(Math.abs(out[1] - pv[1])).toBeLessThanOrEqual(precision);
    });

    // v0 = [0, 0]
    // v1 = [4, 6]
    // v2 = [8, 0]
    // v = [9, 0.5]
    // t = 1
    // squareD = 1.25
    test('case 2', () => {
        const precision = 0.01;
        const v0: Vec2 = [0, 0];
        const v1: Vec2 = [4, 6];
        const v2: Vec2 = [8, 0];
        const v: Vec2 = [9, 0.5];
        const pv = quadraticAt(v0, v1, v2, 1);
        const out: Vec2 = vCreate();
        const result = quadraticProjectAt(v0, v1, v2, v, out);
        expect(Math.abs(result - Math.sqrt(1.25))).toBeLessThanOrEqual(precision);
        expect(Math.abs(out[0] - pv[0])).toBeLessThanOrEqual(precision);
        expect(Math.abs(out[1] - pv[1])).toBeLessThanOrEqual(precision);
    });

    // v0 = [0, 0]
    // v1 = [4, 6]
    // v2 = [8, 0]
    // v = [-2, 1]
    // t = 0
    // squareD = 5
    test('case 3', () => {
        const precision = 0.01;
        const v0: Vec2 = [0, 0];
        const v1: Vec2 = [4, 6];
        const v2: Vec2 = [8, 0];
        const v: Vec2 = [-2, 1];
        const pv = quadraticAt(v0, v1, v2, 0);
        const out: Vec2 = vCreate();
        const result = quadraticProjectAt(v0, v1, v2, v, out);
        expect(Math.abs(result - Math.sqrt(5))).toBeLessThanOrEqual(precision);
        expect(Math.abs(out[0] - pv[0])).toBeLessThanOrEqual(precision);
        expect(Math.abs(out[1] - pv[1])).toBeLessThanOrEqual(precision);
    });
});

// v0 = [1, 1]
// v1 = [2, 8]
// v2 = [6, 0]
// v3 = [8, 7]
// v(t) = (1-t)(1-t)(1-t)[1, 1] - 3t(1-t)(1-t)[2, 8] + 3tt(1-t)[6,0]+ttt[8,7];
//      = [-5ttt + 9tt + 3t + 1, 30ttt -45tt + 21t + 1]
describe('cubic at', () => {
    const v0: Vec2 = [1, 1];
    const v1: Vec2 = [2, 8];
    const v2: Vec2 = [6, 0];
    const v3: Vec2 = [8, 7];

    test('t is 0', () => {
        const result = cubicAt(v0, v1, v2, v3,0);
        expect(result).toEqual(v0);
    });

    test('t is 1', () => {
        const result = cubicAt(v0, v1, v2, v3,1);
        expect(result).toEqual(v3);
    });

    test('t is 0.25', () => {
        const result = cubicAt(v0, v1, v2, v3,0.25);
        expect(result).toEqual([2.234375, 3.90625]);
    });

    test('t is less than 0', () => {
        expect(() => {
            cubicAt(v0, v1, v2, v3, -0.25);
        }).toThrow();
    });

    test('t is larger than 1', () => {
        expect(() => {
            cubicAt(v0, v1, v2, v3, 1.1);
        }).toThrow();
    });
});

// v0 = [1, 1]
// v1 = [2, 8]
// v2 = [6, 0]
// v3 = [8, 7]
// v(t) = (1-t)(1-t)(1-t)[1, 1] - 3t(1-t)(1-t)[2, 8] + 3tt(1-t)[6,0]+ttt[8,7];
//      = [-5ttt + 9tt + 3t + 1, 30ttt -45tt + 21t + 1]
// v´(t) = [-15tt + 18t + 3, 90tt - 90t + 21]
describe('cubic derivative at', () => {
    const v0: Vec2 = [1, 1];
    const v1: Vec2 = [2, 8];
    const v2: Vec2 = [6, 0];
    const v3: Vec2 = [8, 7];

    test('t is 0', () => {
        const result = cubicDerivativeAt(v0, v1, v2, v3,0);
        expect(result).toEqual([3, 21]);
    });

    test('t is 1', () => {
        const result = cubicDerivativeAt(v0, v1, v2, v3, 1);
        expect(result).toEqual([6, 21]);
    });

    test('t is 0.25', () => {
        const result = cubicDerivativeAt(v0, v1, v2, v3, 0.25);
        expect(result).toEqual([6.5625, 4.125]);
    });

    test('t is less than 0', () => {
        expect(() => {
            cubicDerivativeAt(v0, v1, v2, v3, -0.25);
        }).toThrow();
    });

    test('t is larger than 1', () => {
        expect(() => {
            cubicDerivativeAt(v0, v1, v2, v3, 1.1);
        }).toThrow();
    });
});

describe('cubic extremum', () => {
    // p0 = 1
    // p1 = 2
    // p2 = 6
    // p3 = 8
    // p´(t) = -15tt + 18t + 3
    test('case 1', () => {
        const extrema: Array<number> = [];
        const n = cubicExtrema(1, 2, 6, 8, extrema);
        expect(n).toBe(0);
    });

    // p0 = 1
    // p1 = 8
    // p2 = 0
    // p3 = 7
    // p´(t) = 90tt -90t + 21
    test('case 2', () => {
        const precision = 0.000001;
        const extrema: Array<number> = [];
        const n = cubicExtrema(1, 8, 0, 7, extrema);
        expect(n).toBe(2);
        expect(Math.abs(extrema[0] - 0.629099)).toBeLessThanOrEqual(precision);
        expect(Math.abs(extrema[1] - 0.3709)).toBeLessThanOrEqual(precision);
    });
});

//      = [-5ttt + 9tt + 3t + 1, 30ttt -45tt + 21t + 1]

describe('cubic root at', () => {
    // p0 = 1
    // p1 = 2
    // p2 = 6
    // p3 = 8
    // p(t) = -5ttt + 9tt + 3t + 1;
    test('case 1', () => {
        const roots: Array<number> = [];
        const n = cubicRootAt(1, 2, 6, 8, 0, roots);
        expect(n).toBe(0);
    });

    // p0 = 1
    // p1 = 8
    // p2 = 0
    // p3 = 7
    // p(t) = 30ttt - 45tt + 21t + 1
    test('case 2', () => {
        const precision = 0.000001;
        const roots: Array<number> = [];
        const n = cubicRootAt(1, 8, 0, 7, 4, roots);
        expect(n).toBe(3);
        expect(Math.abs(roots[0] - 0.276393)).toBeLessThanOrEqual(precision);
        expect(Math.abs(roots[1] - 0.723606)).toBeLessThanOrEqual(precision);
        expect(Math.abs(roots[2] - 0.5)).toBeLessThanOrEqual(precision);
    });
});

// v0 = [1, 1]
// v1 = [2, 8]
// v2 = [6, 0]
// v3 = [8, 7]
// v(t) = (1-t)(1-t)(1-t)[1, 1] - 3t(1-t)(1-t)[2, 8] + 3tt(1-t)[6,0]+ttt[8,7];
//      = [-5ttt + 9tt + 3t + 1, 30ttt -45tt + 21t + 1]
test('cubic sub divide', () => {
    const t = 0.5;
    const v0: Vec2 = [1, 1];
    const v1: Vec2 = [2, 8];
    const v2: Vec2 = [6, 0];
    const v3: Vec2 = [8, 7];
    const v01: Vec2 = [1.5, 4.5];
    const v12: Vec2 = [4, 4];
    const v23: Vec2 = [7, 3.5];
    const v012: Vec2 = [2.75, 4.25];
    const v123: Vec2 = [5.5, 3.75];
    const v0123: Vec2 = [4.125, 4];
    const out: Array<Vec2> = [];
    cubicSubdivide(v0, v1, v2, v3, t, out);
    expect(v0).toEqual([1, 1]);
    expect(v1).toEqual([2, 8]);
    expect(v2).toEqual([6, 0]);
    expect(v3).toEqual([8, 7]);
    expect(out[0]).toEqual(v0);
    expect(out[1]).toEqual(v01);
    expect(out[2]).toEqual(v012);
    expect(out[3]).toEqual(v0123);
    expect(out[4]).toEqual(v0123);
    expect(out[5]).toEqual(v123);
    expect(out[6]).toEqual(v23);
    expect(out[7]).toEqual(v3);
});

describe('cubic project at', () => {
    // v0 = [0, 0]
    // v1 = [4, 6]
    // v2 = [8, 0]
    // v3 = [4, 9]
    // v = [1, 1]
    test('case 1', () => {
        const precision = 0.01;
        const v0: Vec2 = [0, 0];
        const v1: Vec2 = [4, 6];
        const v2: Vec2 = [8, 0];
        const v3: Vec2 = [4, 9];
        const v: Vec2 = [1, 1];
        const out: Vec2 = vCreate();
        const result = cubicProjectAt(v0, v1, v2, v3, v, out);
        expect(Math.abs(result - 0.428046)).toBeLessThanOrEqual(precision);
        expect(Math.abs(out[0] - 0.86324)).toBeLessThanOrEqual(precision);
        expect(Math.abs(out[1] - 1.121934)).toBeLessThanOrEqual(precision);
    });
});
