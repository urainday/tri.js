/**
 * @file utility functions for cubic and quadratic Bézier curves
 */
import {
    Vec2,
    create as vCreate,
    linearInterpolation as vLinearInterpolation,
    distance as vDistance,
    copy as vCopy
} from './vector';

const EPSILON = 1e-8;
const EPSILON_NUMERIC = 1e-4;

function isAroundZero(val: number): boolean {
    return val > -EPSILON && val < EPSILON;
}

function isNotAroundZero(val: number): boolean {
    return val > EPSILON || val < -EPSILON;
}

// quadratic

/**
 * The mathematics of quadratic Bézier curve
 * const v01 = (1 - t) * v0 + t * v1;
 * const v12 = (1 - t) * v1 + t * v2;
 * return (1 - t) * v01 + t * v12;
 *
 * @param {Vec2} v0 the first control point
 * @param {Vec2} v1 the second control point
 * @param {Vec2} v2 the third control point
 * @param {number} t interval range from 0 to 1
 * @return {Vec2} quadratic Bézier curve value
 * @throws will throw Error if t is not range from 0 to 1.
 */
export function quadraticAt(
    v0: Vec2,
    v1: Vec2,
    v2: Vec2,
    t: number
): Vec2 {
    if (t < 0 || t > 1) {
        throw new Error(`interval is ${t}, it should range from 0 to 1.`);
    }

    const v01 = vLinearInterpolation(vCreate(), v0, v1, t);
    const v12 = vLinearInterpolation(vCreate(), v1, v2, t);
    const v012 = vLinearInterpolation(vCreate(), v01, v12, t);
    return v012;
}

/**
 * The derivative at t of the quadratic Bézier curve
 *
 * @param {Vec2} v0 the first control point
 * @param {Vec2} v1 the second control point
 * @param {Vec2} v2 the third control point
 * @param {number} t interval range from 0 to 1
 * @return {Vec2} quadratic Bézier curve derivative value
 * @throws will throw Error if t is not range from 0 to 1.
 */
export function quadraticDerivativeAt(
    v0: Vec2,
    v1: Vec2,
    v2: Vec2,
    t: number
): Vec2 {
    if (t < 0 || t > 1) {
        throw new Error(`interval is ${t}, it should range from 0 to 1.`);
    }

    const [x0, y0] = v0;
    const [x1, y1] = v1;
    const [x2, y2] = v2;
    const out = vCreate();
    out[0] = 2 * ((1 - t) * (x1 - x0) + t * (x2 - x1));
    out[1] = 2 * ((1 - t) * (y1 - y0) + t * (y2 - y1));
    return out;
}

/**
 * Find the extremum of quadratic Bézier curve
 *
 * We find the extremum by solving the equation B'(t) = 0
 * @param {number} p0 the first control point
 * @param {number} p1 the second control point
 * @param {number} p2 the third control point
 * @return {number} extremum t of quadratic Bézier curve
 */
export function quadraticExtremum(
    p0: number,
    p1: number,
    p2: number
): number {
    // B'(t) = 2 * ((1 - t) * (p1 - p0) + t * (p2 - p1))
    const divider = p0 - 2 * p1 + p2;
    if (divider === 0) {
        return 0.5;
    } else {
        return (p0 - p1) / divider;
    }
}

/**
 * Find the root of quadratic Bézier curve
 *
 * @param {number} p0 the first control point
 * @param {number} p1 the second control point
 * @param {number} p2 the third control point
 * @param {number} val target value
 * @param {Array<number>} roots results
 * @return {number} the number of roots
 */
export function quadraticRootAt(
    p0: number,
    p1: number,
    p2: number,
    val: number,
    roots: Array<number>
): number {
    const a = p0 - 2 * p1 + p2;
    const b = 2 * (p1 - p0);
    const c = p0 - val;

    let n = 0;
    if (isAroundZero(a)) {
        if (isNotAroundZero(b)) {
            const t1 = -c / b;
            if (t1 >= 0 && t1 <= 1) {
                roots[n++] = t1;
            }
        }
    } else {
        const disc = b * b - 4 * a * c;
        if (isAroundZero(disc)) {
            const t1 = -b / (2 * a);
            if (t1 >= 0 && t1 <= 1) {
                roots[n++] = t1;
            }
        } else if (disc > 0) {
            const discSqrt = Math.sqrt(disc);
            const t1 = (-b + discSqrt) / (2 * a);
            if (t1 >= 0 && t1 <= 1) {
                roots[n++] = t1;
            }
            const t2 = (-b - discSqrt) / (2 * a);
            if (t2 >= 0 && t2 <= 1) {
                roots[n++] = t2;
            }
        }
    }
    return n;
}

/**
 * Subdivide quadratic Bézier curve
 *
 * @param {number} v0 the first control point
 * @param {number} v1 the second control point
 * @param {number} v2 the third control point
 * @param {number} t interval range from 0 to 1
 * @param {Array<Vec2>} out results
 * @throws will throw Error if t is not range from 0 to 1.
 */
export function quadraticSubdivide(
    v0: Vec2,
    v1: Vec2,
    v2: Vec2,
    t: number,
    out: Array<Vec2>
): void {
    if (t < 0 || t > 1) {
        throw new Error(`interval is ${t}, it should range from 0 to 1.`);
    }

    const v01 = vLinearInterpolation(vCreate(), v0, v1, t);
    const v12 = vLinearInterpolation(vCreate(), v1, v2, t);
    const v012 = vLinearInterpolation(vCreate(), v01, v12, t);

    // Seg0
    out[0] = v0;
    out[1] = v01;
    out[2] = v012;

    // Seg1
    out[3] = v012;
    out[4] = v12;
    out[5] = v2;
}

/**
 * The approximate projection of a point to rational cubic Bézier curve.
 * http://pomax.github.io/bezierinfo/#projections
 *
 * @param {Vec2} v0 the first control point
 * @param {Vec2} v1 the second control point
 * @param {Vec2} v2 the third control point
 * @param {Vec2} v point
 * @param {Vec2} out approximate projection point
 * @return {number} distance
 */
export function quadraticProjectAt(
    v0: Vec2,
    v1: Vec2,
    v2: Vec2,
    v: Vec2,
    out: Vec2
): number {
    let pt: number;
    let pd = Infinity;

    for (let t = 0; t <= 1; t += 0.05) {
        const vt = quadraticAt(v0, v1, v2, t);
        const d = vDistance(v, vt);
        if (d < pd) {
            pd = d;
            pt = t;
        }
    }

    let interval = 0.005;
    pd = Infinity;
    // At most 32 iteration
    for (let i = 0; i < 32; i++) {
        if (interval < EPSILON_NUMERIC) {
            break;
        }
        const prevT = pt - interval;
        const prevV = quadraticAt(v0, v1, v2, prevT);
        const prevD = vDistance(v, prevV);

        if (prevT >= 0 && prevD < pd) {
            pt = prevT;
            pd = prevD;
        } else {
            const nextT = pt + interval;
            const nextV = quadraticAt(v0, v1, v2, nextT);
            const nextD = vDistance(v, nextV);
            if (nextT <= 1 && nextD < pd) {
                pt = nextT;
                pd = nextD;
            } else {
                interval *= 0.5;
            }
        }
    }

    const pv = quadraticAt(v0, v1, v2, pt);
    vCopy(out, pv);

    return Math.sqrt(pd);
}


// cubic

/**
 * The mathematics of cubic Bézier curve
 * @param {Vec2} v0 the first control point
 * @param {Vec2} v1 the second control point
 * @param {Vec2} v2 the third control point
 * @param {Vec2} v3 the fourth control point
 * @param {number} t interval range from 0 to 1
 * @return {Vec2} cubic Bézier curve value
 * @throws will throw Error if t is not range from 0 to 1.
 */
export function cubicAt(
    v0: Vec2,
    v1: Vec2,
    v2: Vec2,
    v3: Vec2,
    t: number
): Vec2 {
    if (t < 0 || t > 1) {
        throw new Error(`interval is ${t}, it should range from 0 to 1.`);
    }

    const v01 = vLinearInterpolation(vCreate(), v0, v1, t);
    const v12 = vLinearInterpolation(vCreate(), v1, v2, t);
    const v23 = vLinearInterpolation(vCreate(), v2, v3, t);
    const v012 = vLinearInterpolation(vCreate(), v01, v12, t);
    const v123 = vLinearInterpolation(vCreate(), v12, v23, t);
    const v0123 = vLinearInterpolation(vCreate(), v012, v123, t);
    return v0123;
}

/**
 * The derivative at t of the cubic Bézier curve
 *
 * @param {Vec2} v0 the first control point
 * @param {Vec2} v1 the second control point
 * @param {Vec2} v2 the third control point
 * @param {Vec2} v3 the fourth control point
 * @param {number} t interval range from 0 to 1
 * @return {Vec2} cubic Bézier curve value
 * @throws will throw Error if t is not range from 0 to 1.
 */
export function cubicDerivativeAt(
    v0: Vec2,
    v1: Vec2,
    v2: Vec2,
    v3: Vec2,
    t: number
) {
    if (t < 0 || t > 1) {
        throw new Error(`interval is ${t}, it should range from 0 to 1.`);
    }

    const [x0, y0] = v0;
    const [x1, y1] = v1;
    const [x2, y2] = v2;
    const [x3, y3] = v3;
    const out = vCreate();
    const mt = 1 - t;
    out[0] = 3 * (((x1 - x0) * mt + 2 * (x2 - x1) * t) * mt + (x3 - x2) * t * t);
    out[1] = 3 * (((y1 - y0) * mt + 2 * (y2 - y1) * t) * mt + (y3 - y2) * t * t);
    return out;
}

/**
 * Find the extremum of cubic Bézier curve
 *
 * We find the extremum by solving the equation B'(t) = 0
 * @param {number} p0 the first control point
 * @param {number} p1 the second control point
 * @param {number} p2 the third control point
 * @param {number} p3 the fourth control point
 * @return {number} extremum t of quadratic Bézier curve
 */
export function cubicExtrema(
    p0: number,
    p1: number,
    p2: number,
    p3: number,
    extrema: Array<number>
): number {
    const a = 9 * p1 + 3 * p3 - 3 * p0 - 9 * p2;
    const b = 6 * p2 - 12 * p1 + 6 * p0;
    const c = 3 * p1 - 3 * p0;

    let n = 0;
    if (isAroundZero(a)) {
        if (isNotAroundZero(b)) {
            const t1 = -c / b;
            if (t1 >= 0 && t1 <= 1) {
                extrema[n++] = t1;
            }
        }
    } else {
        const disc = b * b - 4 * a * c;
        if (isAroundZero(disc)) {
            extrema[0] -b / (2 * a);
        } else if (disc > 0) {
            const discSqrt = Math.sqrt(disc);
            const t1 = (-b + discSqrt) / (2 * a);
            if (t1 >= 0 && t1 <= 1) {
                extrema[n++] = t1;
            }
            const t2 = (-b - discSqrt) / (2 * a);
            if (t2 >= 0 && t2 <= 1) {
                extrema[n++] = t2;
            }
        }
    }
    return n;
}

/**
 * Use Sheng Jin formula to find the root of cubic Bézier curve
 *
 * @param {number} p0 the first control point
 * @param {number} p1 the second control point
 * @param {number} p2 the third control point
 * @param {number} p3 the fourth control point
 * @param {number} val target value
 * @param {Array<number>} roots results
 * @return {number} the number of roots
 */
export function cubicRootAt(
    p0: number,
    p1: number,
    p2: number,
    p3: number,
    val: number,
    roots: Array<number>
): number {
    const a = p3 + 3 * (p1 - p2) - p0;
    const b = 3 * (p2 - p1 * 2 + p0);
    const c = 3 * (p1 - p0);
    const d = p0 - val;

    const A = b * b - 3 * a * c;
    const B = b * c - 9 * a * d;
    const C = c * c - 3 * b * d;

    let n = 0;
    if (isAroundZero(A) && isAroundZero(B)) {
        if (isAroundZero(b)) {
            roots[0] = 0;
        }
        else {
            const t1 = -c / b;  //t1, t2, t3, b is not zero
            if (t1 >= 0 && t1 <= 1) {
                roots[n++] = t1;
            }
        }
    }
    else {
        const disc = B * B - 4 * A * C;

        if (isAroundZero(disc)) {
            const K = B / A;
            const t1 = -b / a + K;  // t1, a is not zero
            const t2 = -K / 2;  // t2, t3
            if (t1 >= 0 && t1 <= 1) {
                roots[n++] = t1;
            }
            if (t2 >= 0 && t2 <= 1) {
                roots[n++] = t2;
            }
        }
        else if (disc > 0) {
            const discSqrt = Math.sqrt(disc);
            let Y1 = A * b + 1.5 * a * (-B + discSqrt);
            let Y2 = A * b + 1.5 * a * (-B - discSqrt);
            if (Y1 < 0) {
                Y1 = -Math.pow(-Y1, 1 / 3);
            }
            else {
                Y1 = Math.pow(Y1, 1 / 3);
            }
            if (Y2 < 0) {
                Y2 = -Math.pow(-Y2, 1 / 3);
            }
            else {
                Y2 = Math.pow(Y2, 1 / 3);
            }
            const t1 = (-b - (Y1 + Y2)) / (3 * a);
            if (t1 >= 0 && t1 <= 1) {
                roots[n++] = t1;
            }
        }
        else {
            const T = (2 * A * b - 3 * a * B) / (2 * Math.sqrt(A * A * A));
            const theta = Math.acos(T) / 3;
            const ASqrt = Math.sqrt(A);
            const tmp = Math.cos(theta);

            const t1 = (-b - 2 * ASqrt * tmp) / (3 * a);
            const t2 = (-b + ASqrt * (tmp + Math.sqrt(3) * Math.sin(theta))) / (3 * a);
            const t3 = (-b + ASqrt * (tmp - Math.sqrt(3) * Math.sin(theta))) / (3 * a);
            if (t1 >= 0 && t1 <= 1) {
                roots[n++] = t1;
            }
            if (t2 >= 0 && t2 <= 1) {
                roots[n++] = t2;
            }
            if (t3 >= 0 && t3 <= 1) {
                roots[n++] = t3;
            }
        }
    }
    return n;
}

/**
 * Subdivide cubic Bézier curve
 *
 * @param {number} v0 the first control point
 * @param {number} v1 the second control point
 * @param {number} v2 the third control point
 * @param {number} v3 the third control point
 * @param {number} t interval range from 0 to 1
 * @param {Array<Vec2>} out results
 * @throws will throw Error if t is not range from 0 to 1.
 */
export function cubicSubdivide(
    v0: Vec2,
    v1: Vec2,
    v2: Vec2,
    v3: Vec2,
    t: number,
    out: Array<Vec2>
): void {
    if (t < 0 || t > 1) {
        throw new Error(`interval is ${t}, it should range from 0 to 1.`);
    }

    const v01 = vLinearInterpolation(vCreate(), v0, v1, t);
    const v12 = vLinearInterpolation(vCreate(), v1, v2, t);
    const v23 = vLinearInterpolation(vCreate(), v2, v3, t);
    const v012 = vLinearInterpolation(vCreate(), v01, v12, t);
    const v123 = vLinearInterpolation(vCreate(), v12, v23, t);
    const v0123 = vLinearInterpolation(vCreate(), v012, v123, t);

    // Seg0
    out[0] = v0;
    out[1] = v01;
    out[2] = v012;
    out[3] = v0123;

    // Seg1
    out[4] = v0123;
    out[5] = v123;
    out[6] = v23;
    out[7] = v3;
}


/**
 * The approximate projection of a point to rational cubic Bézier curve.
 * http://pomax.github.io/bezierinfo/#projections
 *
 * @param {Vec2} v0 the first control point
 * @param {Vec2} v1 the second control point
 * @param {Vec2} v2 the third control point
 * @param {Vec2} v3 the fourth control point
 * @param {Vec2} v point
 * @param {Vec2} out approximate projection point
 * @return {number} distance
 */
export function cubicProjectAt(
    v0: Vec2,
    v1: Vec2,
    v2: Vec2,
    v3: Vec2,
    v: Vec2,
    out: Vec2
): number {
    let pt: number;
    let pd = Infinity;

    for (let t = 0; t <= 1; t += 0.05) {
        const vt = cubicAt(v0, v1, v2, v3, t);
        const d = vDistance(v, vt);
        if (d < pd) {
            pd = d;
            pt = t;
        }
    }

    let interval = 0.005;
    pd = Infinity;
    // At most 32 iteration
    for (let i = 0; i < 32; i++) {
        if (interval < EPSILON_NUMERIC) {
            break;
        }
        const prevT = pt - interval;
        const prevV = cubicAt(v0, v1, v2, v3, prevT);
        const prevD = vDistance(v, prevV);

        if (prevT >= 0 && prevD < pd) {
            pt = prevT;
            pd = prevD;
        } else {
            const nextT = pt + interval;
            const nextV = cubicAt(v0, v1, v2, v3, nextT);
            const nextD = vDistance(v, nextV);
            if (nextT <= 1 && nextD < pd) {
                pt = nextT;
                pd = nextD;
            } else {
                interval *= 0.5;
            }
        }
    }

    const pv = cubicAt(v0, v1, v2, v3, pt);
    vCopy(out, pv);

    return Math.sqrt(pd);
}
