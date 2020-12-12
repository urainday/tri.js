/**
 * @file two Dimensional vector
 */

import {Matrix} from './matrix';
import {isInRange} from './curve';

export type Vec2 = [number, number];

/**
 * Creates a new Vec2 initialized with the given values
 *
 * @param {number} x x component
 * @param {number} y y component
 * @return {Vec2} a new Vec2
 */
export function create(x: number = 0, y: number = 0): Vec2{
    const out: Vec2 = [x, y];
    return out;
}

/**
 * Copy the values from one Vec2 to another
 *
 * @param {Vec2} out the receiving Vec2
 * @param {Vec2} v the source Vec2
 * @return {Vec2} out
 */
export function copy(out: Vec2, v: Vec2) {
    out[0] = v[0];
    out[1] = v[1];
    return out;
}

/**
 * Create a new Vec2 initialized with values from the source vector
 *
 * @param {Vec2} v the source vector to clone
 * @return {Vec2} a new vector
 */
export function clone(v: Vec2): Vec2 {
    const out = create();
    out[0] = v[0];
    out[1] = v[1];
    return out;
}

/**
 * Calculates the euclidian distance between two Vec2's
 *
 * @param {Vec2} v1 the first operand
 * @param {Vec2} v2 the second operand
 * @return {number} distance between v1 and v2
 */
export function distance(v1: Vec2, v2: Vec2): number {
    return Math.sqrt(squaredDistance(v1, v2));
}

/**
 * Calculates the squared euclidian distance between two Vec2's
 *
 * @param {Vec2} v1 the first operand
 * @param {Vec2} v2 the second operand
 * @return {number} squared distance between v1 and v2
 */
export function squaredDistance(v1: Vec2, v2: Vec2): number {
    const x = v1[0] - v2[0];
    const y = v1[1] - v2[1];
    return x * x + y * y;
}

/**
 * Calculates the linear interpolation of v1 and v2
 *
 * @param {Vec2} out the receiving vector
 * @param {Vec2} v1 the first operand
 * @param {Vec2} v2 the second operand
 * @param {number} t interval range from 0 to 1
 * @return {Vec2} out
 * @throws will throw Error if t is not range from 0 to 1.
 */
export function linearInterpolation(out: Vec2, v1: Vec2, v2: Vec2, t: number): Vec2 {
    if (!isInRange(0, 1, t)) {
        throw new Error(`interval is ${t}, it should range from 0 to 1.`);
    }

    const x = (1 - t) * v1[0] + t * v2[0];
    const y = (1 - t) * v1[1] + t * v2[1];
    out[0] = x;
    out[1] = y;
    return out;
}

/**
 * Adds two Vec2's
 *
 * @param {Vec2} out the receiving vector
 * @param {Vec2} v1 the first operand
 * @param {Vec2} v1 the second operand
 * @return {Vec2} out
 */
export function add(out: Vec2, v1: Vec2, v2: Vec2): Vec2 {
    out[0] = v1[0] + v2[0];
    out[1] = v1[1] + v2[1];
    return out;
}

/**
 * Subtracts vector v2 from vector v1
 *
 * @param {Vec2} out the receiving vector
 * @param {Vec2} v1 the first operand
 * @param {Vec2} v2 the second operand
 * @return {Vec2} out
 */
export function sub(out: Vec2, v1: Vec2, v2: Vec2): Vec2 {
    out[0] = v1[0] - v2[0];
    out[1] = v1[1] - v2[1];
    return out;
}

/**
 * Multiplies two Vec2's
 *
 * @param {Vec2} out the receiving vector
 * @param {Vec2} v1 the first operand
 * @param {Vec2} v2 the second operand
 * @return {Vec2} out
 */
export function mul(out: Vec2, v1: Vec2, v2: Vec2): Vec2 {
    out[0] = v1[0] * v2[0];
    out[1] = v1[1] * v2[1];
    return out;
}

/**
 * Divides two Vec2's
 *
 * @param {Vec2} out the receiving vector
 * @param {Vec2} v1 the first operand
 * @param {Vec2} v2 the second operand
 * @return {Vec2} out
 * @throws will throws Error if v2[0] === 0 || v2[1] === 0
 */
export function div(out: Vec2, v1: Vec2, v2: Vec2): Vec2 {
    if (v2[0] === 0 || v2[1] === 0) {
        throw new Error('illegal argument exception, v2[0] or v2[1] is 0');
    }
    out[0] = v1[0] / v2[0];
    out[1] = v1[1] / v2[1];
    return out;
}

/**
 * Scales a Vec2 by a scalar number
 *
 * @param {Vec2} out the receiving vector
 * @param {Vec2} v the vector to scale
 * @param {number} s amount to scale the vector by
 * @return {Vec2} out
 */
export function scale(out: Vec2, v: Vec2, s: number) {
    out[0] = v[0] * s;
    out[1] = v[1] * s;
    return out;
}

/**
 * Normalize a Vec2
 *
 * @param {Vec2} out the receiving vector
 * @param {Vec2} v vector to normalize
 * @return {Vec2} out
 */
export function normalize(out: Vec2, v: Vec2): Vec2 {
    const [x, y] = v;
    const len = Math.sqrt(x * x + y * y);
    if (len === 0) {
        out[0] = 0;
        out[1] = 0;
    } else {
        out[0] = x / len;
        out[1] = y / len;
    }
    return out;
}

/**
 * Calculate a vector transformed with an matrix
 *
 * @param {Vec2} out the receiving vector
 * @param {Vec2} v the vector to transform
 * @param {matrix} m transform matrix
 * @return {Vec2} out
 */
export function applyTransform(out: Vec2, v: Vec2, m: Matrix): Vec2 {
    const [x, y] = v;
    out[0] = m[0] * x + m[2] * y + m[4];
    out[1] = m[1] * x + m[3] * y + m[5];
    return out;
}

/**
 * Return the minimum of two Vec2's
 *
 * @param {Vec2} out the receiving vector
 * @param {Vec2} v1 the first operand
 * @param {Vec2} v2 the second operand
 * @return {Vec2} out
 */
export function min(out: Vec2, v1: Vec2, v2: Vec2): Vec2 {
    out[0] = Math.min(v1[0], v2[0]);
    out[1] = Math.min(v1[1], v2[1]);
    return out;
}

/**
 * Return the maximum of two Vec2's
 *
 * @param {Vec2} out the receiving vector
 * @param {Vec2} v1 the first operand
 * @param {Vec2} v2 the second operand
 * @return {Vec2} out
 */
export function max(out: Vec2, v1: Vec2, v2: Vec2): Vec2 {
    out[0] = Math.max(v1[0], v2[0]);
    out[1] = Math.max(v1[1], v2[1]);
    return out;
}

