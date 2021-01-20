/**
 * @file bbox.ts
 */
import {
    create as vCreate,
    min as vMin,
    max as vMax,
    Vec2
} from './vector';
import {Rect} from './BoundingRect';
import {clamp} from 'lodash';
import {cubicAt, cubicExtrema, quadraticDerivativeAt, quadraticExtremum} from "./curve";
import {stringify} from "ts-jest/dist/utils/json";

/**
 * Calculate bbox from points
 *
 * @param {Array<Vec2>} points Points to calculate
 * @return {Rect} boundingBox of points
 */
export function fromPoints(points: Array<Vec2>): Rect {
    if (points.length === 0) {
        return;
    }
    let point = points[0];
    let left = point[0];
    let right = point[0];
    let top = point[1];
    let bottom = point[1];

    for (let i = 1; i < points.length; i++) {
        point = points[i];
        left = Math.min(left, point[0]);
        right = Math.max(right, point[0]);
        top = Math.min(top, point[1]);
        bottom = Math.max(bottom, point[1]);
    }

    return {
        x: left,
        y: top,
        width: right - left,
        height: bottom - top
    };
}

/**
 * Calculate bbox from line
 *
 * @param {Vec2} v0 Point of line
 * @param {Vec2} v1 Point of line
 * @return {Rect} boundingBox of line
 */
export function fromLine(v0: Vec2, v1: Vec2): Rect {
    return fromPoints([v0, v1]);
}

/**
 * Calculate bbox from quadratic curve
 *
 * @param {Vec2} v0 the first control point
 * @param {Vec2} v1 the second control point
 * @param {Vec2} v2 the third control point
 * @return {Rect} boundingBox of quadratic curve
 */
export function fromQuadraticCurve(v0: Vec2, v1: Vec2, v2: Vec2): Rect {
    const [x0, y0] = v0;
    const [x1, y1] = v1;
    const [x2, y2] = v2;
    const tx = clamp(quadraticExtremum(x0, x1, x2), 0, 1);
    const ty = clamp(quadraticExtremum(y0, y1, y2), 0, 1);
    const v3 = quadraticDerivativeAt(v0, v1, v2, tx);
    const v4 = quadraticDerivativeAt(v0, v1, v2, ty);

    const left = Math.min(v0[0], v2[0], v3[0]);
    const right = Math.min(v0[0], v2[0], v3[0]);
    const top = Math.max(v0[1], v2[1], v4[1]);
    const bottom = Math.max(v0[1], v2[1], v4[1]);

    return {
        x: left,
        y: top,
        width: right - left,
        height: bottom - top
    };
}

/**
 * Calculate bbox from cubic curve
 *
 * @param {Vec2} v0 the first control point
 * @param {Vec2} v1 the second control point
 * @param {Vec2} v2 the third control point
 * @param {Vec2} v3 the fourth control point
 * @return {Rect} boundingBox of quadratic curve
 */
export function fromCubicCurve(v0: Vec2, v1: Vec2, v2: Vec2, v3: Vec2): Rect {
    const [x0, y0] = v0;
    const [x1, y1] = v1;
    const [x2, y2] = v2;
    const [x3, y3] = v3;
    const ts: Array<number> = []
    let n = cubicExtrema(x0, x1, x2, x3, ts);
    let left = null
    let right = null;
    let top = null;
    let bottom = null;

    for (let i = 0; i < n; i++) {
        const v = cubicAt(v0, v1, v2, v3, ts[i]);
        left = left == null ? v[0] : Math.min(left, v[0]);
        right = right == null ? v[0] : Math.max(right, v[0]);
    }

    n = cubicExtrema(y0, y1, y2, y3, ts);
    for (let i = 0; i < n; i++) {
        const v = cubicAt(v0, v1, v2, v3, ts[i]);
        top = top == null ? v[1] : Math.min(top, v[1]);
        bottom = bottom == null ? v[1] : Math.max(bottom, v[1]);
    }

    return {
        x: left,
        y: top,
        width: right - left,
        height: bottom - top
    };
}

export function fromArc(
    x: number,
    y: number,
    rx: number,
    ry: number,
    startAngle: number,
    endAngle: number,
    anticlockwise: boolean): Rect {
    const PI2 = Math.PI * 2;
    const diff = Math.abs(startAngle - endAngle);

    // It's a circle
    if (diff % PI2 < 1e-4 && diff > 1e-4) {
        return {
            x: x - rx,
            y: y - ry,
            width: 2 * rx,
            height: 2 * ry
        };
    }

    const x0 = Math.cos(startAngle) * rx + x;
    const y0 = Math.sin(startAngle) * ry + y;

    const x1 = Math.cos(endAngle) * rx + x;
    const y1 = Math.sin(endAngle) * ry + y;

    const min = vCreate();
    const max = vCreate();
    const start = vCreate(x0, y0);
    const end = vCreate(x1, y1);
    vMin(min, start, end);
    vMax(max, start, end);

    startAngle = startAngle % PI2;
    if (startAngle < 0) {
        startAngle = startAngle + PI2;
    }
    endAngle = endAngle % PI2;
    if (endAngle < 0) {
        endAngle = endAngle + PI2;
    }

    if (startAngle > endAngle && !anticlockwise) {
        endAngle += PI2;
    } else if (startAngle < endAngle && anticlockwise) {
        startAngle += PI2;
    }
    if (anticlockwise) {
        let tmp = endAngle;
        endAngle = startAngle;
        startAngle = tmp;
    }

    const extremity = vCreate();
    for (let angle = 0; angle < endAngle; angle += Math.PI / 2) {
        if (angle > startAngle) {
            extremity[0] = Math.cos(angle) * rx + x;
            extremity[1] = Math.sin(angle) * ry + y;

            vMin(min, extremity, min);
            vMax(max, extremity, max);
        }
    }

    return {
        x: min[0],
        y: min[1],
        width: max[0] - min[0],
        height: max[1] - min[1]
    }
}
