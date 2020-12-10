/**
 * @file A corresponding rectangle that that completely encloses the contour.
 */
import {
    identity as mIdentity,
    translate as mTranslate,
    scale as mScale, Matrix
} from './matrix'

import {applyTransform as vec2ApplyTransform, Vec2} from './vector';

export interface Rect {
    x: number,
    y: number,
    width: number,
    height: number
}

class BoundingRect {

    public x: number;

    public y: number;

    public width: number;

    public height: number;

    /**
     * Create an boundingRect.
     *
     * @param rect {Object} the plain rect value.
     */
    static create(rect: Rect): BoundingRect {
        const {x, y, width, height} = rect;
        return new BoundingRect(x, y, width, height);
    }

    constructor(x: number = 0, y: number = 0, width: number = 0, height: number = 0) {
        if (width < 0) {
            x += width;
            width = -width;
        }

        if (height < 0) {
            y += height;
            height = -height;
        }

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    /**
     * Apply transform matrix to this boundingRect
     * @param {Matrix} m transform matrix
     */
    applyTransform(m: Matrix): void {
        if (m == null) {
            return;
        }
        const {x, y, width, height} = this;
        const lt: Vec2 = [x, y];
        const rt: Vec2 = [x + width, y];
        const rb: Vec2 = [x + width, y + height];
        const lb: Vec2 = [x, y + height];

        vec2ApplyTransform(lt, lt, m);
        vec2ApplyTransform(rt, rt, m);
        vec2ApplyTransform(rb, rb, m);
        vec2ApplyTransform(lb, lb, m);

        const x0 = Math.min(lt[0], rt[0], rb[0], lb[0]);
        const y0 = Math.min(lt[1], rt[1], rb[1], lb[1]);
        const x1 = Math.max(lt[0], rt[0], rb[0], lb[0]);
        const y1 = Math.max(lt[1], rt[1], rb[1], lb[1]);
        this.x = x0;
        this.y = y0;
        this.width = x1 - x0;
        this.height = y1 - y0;
    }

    /**
     * Calculate matrix of transforming from self to target rect.
     *
     * @param {BoundingRect} target target BoundingRect.
     */
    calculateTransform(target: BoundingRect): Matrix {
        const {x, y, width, height} = this;
        const sx = target.width / width;
        const sy = target.height / height;

        const m = mIdentity();

        mTranslate(m, m, [-x, -y]);
        mScale(m, m, [sx, sy]);
        mTranslate(m, m, [target.x, target.y]);
        return m;
    }

    /**
     * Set this boundingRect to union of self and other boundingRect.
     *
     * @param {BoundingRect} other other boundingRect.
     */
    union(other: BoundingRect): void {
        const x = Math.min(other.x, this.x);
        const y = Math.min(other.y, this.y);
        this.x = x;
        this.y = y;
        this.width = Math.max(other.x + other.width, this.x + this.width) - x;
        this.height = Math.max(other.y + other.height, this.y + this.height) - y;
    }

    /**
     * Returns true if this boundingRect intersects with other boundingRect.
     *
     * @param {BoundingRect | Rect} other other boundingRect.
     */
    intersect(other: BoundingRect | Rect): boolean {
        if (other == null) {
            return false;
        }
        if (!(other instanceof BoundingRect)) {
            other = BoundingRect.create(other)
        }
        const {x: x0, y: y0, width: width0, height: height0} = this;
        const {x: x1, y: y1, width: width1, height: height1} = other;

        return !(
            (x0 + width0) < x1
            || (x1 + width1) < x0
            || (y0 + height0) < y1
            || (y1 + height1) < y0
        );
    }

    /**
     * Returns true if the boundingRect contains the x and y.
     *
     * @param x x coordinate
     * @param y y coordinate
     * @return {boolean} Returns true if the boundingRect contains the x and y.
     */
    contain(x: number, y: number): boolean {
        return x >= this.x
            && x <= (this.x + this.width)
            && y >= this.y
            && y <= (this.y + this.height);
    }

    /**
     * Create a new boundingRect initialized with values from existing boundingRect.
     *
     * @return {BoundingRect} a new boundingRect
     */
    clone(): BoundingRect {
        const {x, y, width, height} = this;
        return new BoundingRect(x, y, width, height);
    }

    /**
     * Copy the values from one boundingRect to another.
     *
     * @param {BoundingRect} a new boundingRect
     */
    copy(other: BoundingRect): void {
        this.x = other.x;
        this.y = other.y;
        this.width = other.width;
        this.height = other.height;
    }

    /**
     * Return the plain rect value of this boundingRect.
     *
     * @return {Object}
     */
    plain(): Rect {
        const {x, y, width, height} = this;
        return {x, y, width, height};
    }
}

export default BoundingRect;
