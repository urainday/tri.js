/**
 * @file env.spec.ts
 */
import env from "../../src/core/env";

test('node env', () => {
    expect(env.browser).toEqual({
        edge: false,
        firefox: false,
        ie: false,
        newEdge: false,
        weChat: false
    });
    expect(env.node).toEqual(true);
    expect(env.wxa).toEqual(false);
    expect(env.worker).toEqual(false);
    expect(env.canvasSupported).toEqual(true);
    expect(env.svgSupported).toEqual(true);
    expect(env.touchEventsSupported).toEqual(false);
    expect(env.pointerEventsSupported).toEqual(false);
    expect(env.domSupported).toEqual(false);
});
