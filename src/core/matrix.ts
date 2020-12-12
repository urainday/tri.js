/**
 * @file Javascript isomorphic 2D affine transformations write in ES6 syntax.
 */

import {Vec2} from './vector';

export type Matrix = [number, number, number, number, number, number];

/**
 * Creates a new identity matrix
 *
 * @return {Matrix} out the receiving matrix
 */
export function identity(): Matrix {
    const out: Matrix = [1, 0, 0, 1, 0, 0];
    return out;
}

/**
 * Copy the values from m to out
 *
 * @param {Matrix} out the receiving matrix
 * @param {Matrix} m the source matrix
 * @return {Matrix} out
 */
export function copy(out: Matrix, m: Matrix): Matrix {
    out[0] = m[0];
    out[1] = m[1];
    out[2] = m[2];
    out[3] = m[3];
    out[4] = m[4];
    out[5] = m[5];
    return out;
}

/**
 * Create a new matrix initialized with values from the source matrix
 *
 * @param {Matrix} m the source matrix to clone
 * @return {Matrix} a new matrix
 */
export function clone(m: Matrix): Matrix {
    const out = identity();
    copy(out, m);
    return out;
}

/**
 * Invert a matrix
 *
 * @param {Matrix} out the receiving matrix
 * @param {Matrix} m the source matrix
 * @return {Matrix} out
 * @throw will throw Error if m is not invertible
 */
export function invert(out: Matrix, m: Matrix): Matrix {
    const [m0, m1, m2, m3, m4, m5] = m;
    const det = m0 * m3 - m1 * m2;
    if (det === 0) {
        throw new Error('m is not invertible');
    }

    out[0] =  m3 / det;
    out[1] = -m1 / det;
    out[2] = -m2 / det;
    out[3] = m0 / det;
    out[4] = (m2 * m5 - m3 * m4) / det;
    out[5] = (m1 * m4 - m0 * m5) / det;

    return out;
}

/**
 * Scale the matrix by the given vector
 *
 * @param {Matrix} out the receiving matrix
 * @param {Matrix} m the matrix to scale
 * @param {Vec2} v vector to scale the matrix by
 * @return {Matrix} out
 */
export function scale(out: Matrix, m: Matrix, v: Vec2): Matrix {
    out[0] = m[0] * v[0];
    out[1] = m[1] * v[1];
    out[2] = m[2] * v[0];
    out[3] = m[3] * v[1];
    out[4] = m[4] * v[0];
    out[5] = m[5] * v[1];
    return out;
}

/**
 * Skew the matrix by the given vector
 *
 * @param {Matrix} out the receiving matrix
 * @param {Matrix} m the matrix to skew
 * @param {Vec2} v vector to skew the matrix by
 */
export function skew(out: Matrix, m: Matrix, v: Vec2): Matrix {
    const [m0, m1, m2, m3, m4, m5] = m;
    const tx = Math.tan(v[0]);
    const ty = Math.tan(v[1]);
    out[0] = m0 + tx * m1;
    out[1] = ty * m0 + m1;
    out[2] = m2 + tx * m3;
    out[3] = ty * m2 + m3;
    out[4] = m4 + tx * m5;
    out[5] = ty * m4 + m5;
    return out;
}

/**
 * Translate a matrix by the given vector
 *
 * @param {Matrix} out the receiving matrix
 * @param {Matrix} m the matrix to translate
 * @param {Vec2} v vector to translate the matrix by
 * @return {Matrix} out
 */
export function translate(out: Matrix, m: Matrix, v: Vec2): Matrix {
    out[0] = m[0];
    out[1] = m[1];
    out[2] = m[2];
    out[3] = m[3];
    out[4] = m[4] + v[0];
    out[5] = m[5] + v[1];
    return out;
}

/**
 * Rotate a matrix by the given angle
 *
 * @param {Matrix} out the receiving matrix
 * @param {Matrix} m the matrix to rotate
 * @param {number} angle the RAD angle to rotate the matrix by
 * @return {Matrix} out
 */
export function rotate(out: Matrix, m: Matrix, angle: number): Matrix {
    const [m0, m1, m2, m3, m4, m5] = m;
    const st = Math.sin(angle);
    const ct = Math.cos(angle);

    out[0] = m0 * ct + m1 * st;
    out[1] = -m0 * st + m1 * ct;
    out[2] = m2 * ct + m3 * st;
    out[3] = -m2 * st + ct * m3;
    out[4] = ct * m4 + st * m5;
    out[5] = ct * m5 - st * m4;
    return out;
}

/**
 * Multiply two matrices
 *
 * @param {Matrix} out the receiving matrix
 * @param {Matrix} m1 the first operand
 * @param {Matrix} m2 the second operand
 * @return {Matrix} out
 */
export function multiply(out: Matrix, m1: Matrix, m2: Matrix): Matrix {
    const out0 = m1[0] * m2[0] + m1[2] * m2[1];
    const out1 = m1[1] * m2[0] + m1[3] * m2[1];
    const out2 = m1[0] * m2[2] + m1[2] * m2[3];
    const out3 = m1[1] * m2[2] + m1[3] * m2[3];
    const out4 = m1[0] * m2[4] + m1[2] * m2[5] + m1[4];
    const out5 = m1[1] * m2[4] + m1[3] * m2[5] + m1[5];
    out[0] = out0;
    out[1] = out1;
    out[2] = out2;
    out[3] = out3;
    out[4] = out4;
    out[5] = out5;
    return out;
}
