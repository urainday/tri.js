/**
 * @file LRU.spec.ts
 */
import LRU from '../../src/core/LRU';

describe('constructor', () => {
    test('set limit to 4', () => {
        const c = new LRU<number>(4);
        expect(c).not.toBe(null);
    });

    test('without limit parameter', () => {
        const c = new LRU<number>();
        expect(c).not.toBe(null);
    });
});

describe('put && get', () => {
    let c: LRU<number>;
    beforeEach(() => {
        c = new LRU<number>(3);
    });

    test('put - does not contain the key', () => {
        const result = c.put('k1', 29);
        expect(result).toBe(null);
        expect(c.get('k1')).toBe(29);
    });

    test('put - contains the key', () => {
        const result1 = c.put('k1', 29);
        const result2 = c.put('k1', 30);

        expect(result1).toBe(null);
        expect(result2).toBe(29);
        expect(c.get('k1')).toBe(30);
    });

    test('put - exceed the limit(1)', () => {
        const result1 = c.put('k1', 1);
        const result2 = c.put('k2', 2);
        const result3 = c.put('k3', 3);
        const result4 = c.put('k4', 4);

        expect(result1).toBe(null);
        expect(result2).toBe(null);
        expect(result3).toBe(null);
        expect(result4).toBe(1);
        expect(c.get('k1')).toBe(null);
        expect(c.get('k2')).toBe(2);
        expect(c.get('k3')).toBe(3);
        expect(c.get('k4')).toBe(4);
    });

    test('put - exceed the limit(1)', () => {
        const result1 = c.put('k1', 1);
        const result2 = c.put('k2', 2);
        const result3 = c.put('k3', null);
        const result4 = c.get('k1');
        const result5 = c.put('k4', 4);

        expect(result1).toBe(null);
        expect(result2).toBe(null);
        expect(result3).toBe(null);
        expect(result4).toBe(1);
        expect(result5).toBe(2);
        expect(c.get('k1')).toBe(1);
        expect(c.get('k2')).toBe(null);
        expect(c.get('k3')).toBe(null);
        expect(c.get('k4')).toBe(4);
    });
});

test('has', () => {
    const c = new LRU<number>(3);
    c.put('k1', 1);
    c.put('k2', null);
    c.put('k3', 3);
    c.put('k4', 4);

    expect(c.has('k1')).toBeFalsy();
    expect(c.has('k2')).toBeTruthy();
    expect(c.has('k3')).toBeTruthy();
    expect(c.has('k4')).toBeTruthy();
});

test('clear', () => {
    const c = new LRU<number>(3);
    c.put('k1', 1);
    c.put('k2', 2);
    c.clear();
    expect(c.get('k1')).toBe(null);
    expect(c.get('k2')).toBe(null);
});
