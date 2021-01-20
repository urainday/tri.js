/**
 * @file dom.ts
 */

import {create, Vec2} from './vector';
import env from './env';
import buildTransformer from './fourPointsTransform';

const EVENT_SAVED_PROP = '__TRI_EVENTSAVED';

type SavedInfo = {
    markers?: Array<HTMLDivElement>
    trans?: ReturnType<typeof buildTransformer>
    invTrans?: ReturnType<typeof buildTransformer>
    srcCoords?: Array<number>
}

/**
 * Return true if the el is a canvas element.
 *
 * @param {HTMLElement} el
 * @return {boolean} Return true if the el is a canvas element.
 */
export function isCanvasEl(el: HTMLElement): boolean {
    return el.nodeName.toUpperCase() === 'CANVAS';
}

function prepareCoordMarkers(el: HTMLElement, saved: SavedInfo): Array<HTMLDivElement> {
    let markers: Array<HTMLDivElement> = [];
    if (markers) {
        return markers;
    }

    markers = saved.markers = [];

    const propLR = ['left', 'right'];
    const propTB = ['top', 'bottom'];

    for (let i = 0; i < 4; i++) {
        const marker = document.createElement('div');
        const style = marker.style;
        const idxLR = i % 2;
        const idxTB = (i >> 1) % 2;
        style.cssText = [
            'position: absolute',
            'visibility: hidden',
            'padding: 0',
            'margin: 0',
            'border-width: 0',
            'user-select: none',
            'width:0',
            'height:0',
            propLR[idxLR] + ':0',
            propTB[idxTB] + ':0',
            propLR[1 - idxLR] + ':auto',
            propTB[1 - idxTB] + ':auto',
        ].join('!important;');
        el.appendChild(marker);
        markers.push(marker);
    }

    return markers;
}

function preparePointerTransformer(
    markers: Array<HTMLDivElement>,
    saved: SavedInfo,
    inverse?: boolean): ReturnType<typeof buildTransformer> {
    const transformerName = inverse ? 'invTrans' : 'trans';
    const transformer = saved[transformerName];
    const oldSrcCoords = saved.srcCoords;
    const srcCoords = [];
    const destCoords = [];
    let oldCoordTheSame = true;

    for (let i = 0; i < 4; i++) {
        const rect = markers[i].getBoundingClientRect();
        const ii = 2 * i;
        const x = rect.left;
        const y = rect.top;
        srcCoords.push(x, y);
        oldCoordTheSame = oldCoordTheSame && oldSrcCoords && x === oldSrcCoords[ii] && y === oldSrcCoords[ii + 1];
        destCoords.push(markers[i].offsetLeft, markers[i].offsetTop);
    }

    // Cache to avoid time consuming of `buildTransformer`
    if (oldCoordTheSame && transformer) {
        return transformer;
    }

    saved.srcCoords = srcCoords;
    saved[transformerName] = inverse
        ? buildTransformer(destCoords, srcCoords)
        : buildTransformer(srcCoords, destCoords);

    return saved[transformerName];
}

/**
 * Transform between a "viewport coord" and a "local coord".
 * "viewport coord": the coord based on the left-top corner of the viewport of the browser.
 * "local coord": the coord based on the input `el`. The origin point is at the position
 *  of "left: 0; top: 0;" in the `el`.
 *
 * Support the case when CSS transform is used on el.
 *
 * @param {Vec2} out The output. If `inverse: false`, it represents "local coord",
 * otherwise "viewport coord". If can not transform, `out` will not be modified but return `false`
 * @param {HTMLElement} el The "local coord" is based on the `el`.
 * @param {number} inX If `inverse: false`, it represents "viewport coord", otherwise "local coord".
 * @param {number} inY If `inverse: false`, it represents "viewport coord", otherwise "local coord".
 * @param {boolean} inverse `true`: from "viewport coord" to "local port", otherwise from "local coord"
 * to "viewport coord"
 * @return {boolean} true if transform succeed, otherwise return false.
 */
export function transformCoordWithViewport(
    out: Vec2,
    el: HTMLElement,
    inX: number,
    inY: number,
    inverse?: boolean): boolean {
    if (el.getBoundingClientRect && env.domSupported && !isCanvasEl(el)) {
        const saved = (el as any)[EVENT_SAVED_PROP] || ((el as any)[EVENT_SAVED_PROP] = {});
        const markers = prepareCoordMarkers(el, saved);
        const transformer = preparePointerTransformer(markers, saved, inverse);
        if (transformer) {
            transformer(out, inX, inY);
            return true;
        }
    }
    return false;
}

/**
 * Transform "local coord" from `elFrom` to `elTarget`.
 * "local coord": the coord based on the input `el`. The origin point is at
 * the position of "left: 0; top: 0;" in the el.
 *
 * Support when CSS transform is used.
 *
 * Having the `out` (that is `[outX, outY]`), we can create a DOM element
 * and set the CSS style as "left: outX; top: outY;" and append it to `elTarget`
 * to locate the element.
 *
 * For example, this code below positions a child of `document.body` on the event
 * point, no matter whether `body` has `margin/padding/transform...`;
 *
 * ```js
 * const result = transformLocalCoord(out, container, document.body, event.offsetX, event.offsetY);
 * if (result) {
 *     // Then locate the tip element on the event point.
 *     const tipEl = document.createElement('div');
 *     tipEl.style.cssText = 'position: absolute; left:' + out[0] + ';top:' + out[1] + ';';
 *     document.body.appendChild(tipEl);
 * }
 * ```
 * Notice: In some env this method is not supported..
 *
 * @param {Vec2} out The output. If can not transform,
 * `out` will not be modified but return `false`
 * @param {HTMLElement} elFrom The `[inX, inY]` is based on elFrom
 * @param {HTMLElement} elTarget The `out` is based on elTarget.
 * @param {number} inX
 * @param {number} inY
 * @return {boolean} Whether transform successfully
 */
export function transformLocalCoord(
    out: Vec2,
    elFrom: HTMLElement,
    elTarget: HTMLElement,
    inX: number,
    inY: number
): boolean {
    const calcOut = create();
    const result = transformCoordWithViewport(calcOut, elFrom, inX, inY, true);
    if (!result) {
        return false;
    }

    return transformCoordWithViewport(out, elTarget, calcOut[0], calcOut[1]);
}
