/**
 * @file two Dimensional vector
 */

/**
 * Creates a new vec2 initialized with the given values
 *
 * @param {number} x x component
 * @param {number} y y component
 * @return {vec2} a new 2D vector
 */
export function create(x = 0, y = 0) {
    const out = [x, y];
    return out;
}

/**
 * Copy the values from one vec2 to another
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} v the source vector
 * @return out
 */
export function copy(out, v) {
    out[0] = v[0];
    out[1] = v[1];
    return out;
}

/**
 * Create a new vec2 initialized with values from an existing vector
 *
 * @param {vec2} v vector to clone
 * @return {vec2} a new vector
 */
export function clone(v) {
    const out = create();
    out[0] = v[0];
    out[1] = v[1];
    return out;
}

/**
 * Calculates the euclidian distance between two vec2's
 *
 * @param {vec2} v1 the first operand
 * @param {vec2} v2 the second operand
 * @returns {number} distance between v1 and v2
 */
export function distance(v1, v2) {
    return Math.sqrt(squaredDistance(v1, v2));
}

/**
 * Calculates the squared euclidian distance between two vec2's
 *
 * @param {vec2} v1 the first operand
 * @param {vec2} v2 the second operand
 * @returns {number} squared distance between v1 and v2
 */
export function squaredDistance(v1, v2) {
    const x = v1[0] - v2[0];
    const y = v1[1] - v2[1];
    return x * x + y * y;
}

/**
 * Adds two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} v1 the first operand
 * @param {vec2} v1 the second operand
 * @returns out
 */
export function add(out, v1, v2) {
    out[0] = v1[0] + v2[0];
    out[1] = v1[1] + v2[1];
    return out;
}

/**
 * Subtracts vector v2 from vector v1
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} v1 the first operand
 * @param {vec2} v2 the second operand
 * @returns out
 */
export function sub(out, v1, v2) {
    out[0] = v1[0] - v2[0];
    out[1] = v1[1] - v2[1];
    return out;
}

/**
 * Multiplies two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} v1 the first operand
 * @param {vec2} v2 the second operand
 * @returns {vec2} out
 */
export function mul(out, v1, v2) {
    out[0] = v1[0] * v2[0];
    out[1] = v1[1] * v2[1];
    return out;
}

/**
 * Divides two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {ReadonlyVec2} v1 the first operand
 * @param {ReadonlyVec2} v2 the second operand
 * @returns {vec2} out
 */
export function div(out, v1, v2) {
    out[0] = v1[0] / v2[0];
    out[1] = v1[1] / v2[1];
    return out;
}

/**
 * Scales a vec2 by a scalar number
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} v the vector to scale
 * @param {number} s amount to scale the vector by
 * @returns out
 */
export function scale(out, v, s) {
    out[0] = v[0] * s;
    out[1] = v[1] * s;
    return out;
}

/**
 * Normalize a vec2
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} v vector to normalize
 * @returns {vec2} out
 */
export function normalize(out, v) {
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
 * @param {vec2} out the receiving vector
 * @param {vec2} v the vector to transform
 * @param {matrix} m transform matrix
 * @return out
 */
export function applyTransform(out, v, m) {
    const [x, y] = v;
    out[0] = m[0] * x + m[2] * y + m[4];
    out[1] = m[1] * x + m[3] * y + m[5];
    return out;
}

/**
 * Return the minimum of two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} v1 the first operand
 * @param {vec2} v2 the second operand
 * @return out
 */
export function min(out, v1, v2) {
    out[0] = Math.min(v1[0], v2[0]);
    out[1] = Math.min(v1[1], v2[1]);
    return out;
}

/**
 * Return the maximum of two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} v1 the first operand
 * @param {vec2} v2 the second operand
 * @return out
 */
export function max(out, v1, v2) {
    out[0] = Math.max(v1[0], v2[0]);
    out[1] = Math.max(v1[1], v2[1]);
    return out;
}

