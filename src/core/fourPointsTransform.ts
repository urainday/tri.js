/**
 * @file four points transform algorithm
 */
import {Vec2} from './vector';

const LN2 = Math.log(2);

function determinate(
    rows: Array<Array<number>>,
    rank: number,
    rowStart: number,
    rowMask: number,
    colMask: number,
    detCache: Map<string, number>) {
    const fullRank = rows.length;
    const cacheKey = `${rowMask}-${colMask}`;

    if (detCache.has(cacheKey)) {
        return detCache.get(cacheKey);
    }

    if (rank === 1) {
        // In this case the colMask must be like: `11101111`. We can find the place of '0';
        const colStart = Math.round(Math.log(((1 << fullRank) - 1) & ~colMask) / LN2);
        return rows[rowStart][colStart];
    }

    const subRowMask = rowMask | (1 << rowStart);
    let subRowStart = rowStart + 1;
    while ((rowMask & (1 << subRowStart))) {
        subRowStart += 1;
    }

    let sum = 0;
    for (let j = 0, colLocalIdx = 0; j < fullRank; j++) {
        const colTag = 1 << j;
        if (!(colTag & colMask)) {
            sum += (colLocalIdx % 2 ? -1 : 1) * rows[rowStart][j]
                * determinate(rows, rank - 1, subRowStart, subRowMask, colMask | colTag, detCache);
            colLocalIdx++;
        }
    }

    detCache.set(cacheKey, sum);

    return sum;
}

/**
 * four points transform
 * Reference
 * https://franklinta.com/2014/09/08/computing-css-matrix3d-transforms/
 * https://www.jianshu.com/p/f84157116683
 *
 * @param {Array<number>} src source four points, [x0, y0, x1, y1, x2, y2, x3, y3]
 * @param {Array<number>} dest destination four points, [x0, y0, x1, y1, x2, y2, x3, y3]
 * @return {(out: Vec2, srcPointX: number, srcPointY: number) => void} transform If fail, return null
 */

export default function buildTransformer(src: Array<number>, dest: Array<number>) {
    const mA = [
        [src[0], src[1], 1, 0, 0, 0, -dest[0] * src[0], -dest[0] * src[1]],
        [0, 0, 0, src[0], src[1], 1, -dest[1] * src[0], -dest[1] * src[1]],
        [src[2], src[3], 1, 0, 0, 0, -dest[2] * src[2], -dest[2] * src[3]],
        [0, 0, 0, src[2], src[3], 1, -dest[3] * src[2], -dest[3] * src[3]],
        [src[4], src[5], 1, 0, 0, 0, -dest[4] * src[4], -dest[4] * src[5]],
        [0, 0, 0, src[4], src[5], 1, -dest[5] * src[4], -dest[5] * src[5]],
        [src[6], src[7], 1, 0, 0, 0, -dest[6] * src[6], -dest[6] * src[7]],
        [0, 0, 0, src[6], src[7], 1, -dest[7] * src[6], -dest[7] * src[7]]
    ];

    const detCache = new Map<string, number>();
    const det = determinate(mA, 8, 0, 0, 0, detCache);
    if (det === 0) {
        return;
    }

    const vh: Array<number> = [];
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (vh[j] == null) {
                vh[j] = 0;
            }
            vh[j] += ((i + j) % 2 ? -1 : 1)
                * determinate(mA, 7, i === 0 ? 1 : 0, 1 << i, 1 << j, detCache)
                / det * dest[i];
        }
    }

    return function (out: Vec2, srcPointX: number, srcPointY: number) {
        const pk = srcPointX * vh[6] + srcPointY * vh[7] + 1;
        out[0] = (srcPointX * vh[0] + srcPointY * vh[1] + vh[2]) / pk;
        out[1] = (srcPointX * vh[3] + srcPointY * vh[4] + vh[5]) / pk;
    };
}
