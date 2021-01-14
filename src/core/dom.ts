/**
 * @file dom.ts
 */

import {Vec2} from './vector';
import env from './env';

const EVENT_SAVED_PROP = '__P9STAR_EVENTSAVED';

/**
 * Return true if the el is a canvas element.
 *
 * @param {HTMLElement} el
 * @return {boolean} Return true if the el is a canvas element.
 */
export function isCanvasEl(el: HTMLElement) {
    return el.nodeName.toUpperCase() === 'CANVAS';
}

export function transformCoordWithViewport(
    out: Vec2,
    el: HTMLElement,
    inX: number,
    inY: number,
    inverse: boolean) {
    if (el.getBoundingClientRect && env.domSupported && !isCanvasEl(el)) {
        
    }
}
