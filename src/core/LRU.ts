/**
 * @file A finite key-value map using the Least Recently Used(LRU) algorithm, where the most
 * recently-used items are "kept alive" while older, less recently-used items are evicted to
 * make room for newer items.
 */
interface KeyValuePair<T> {
    k: string;
    v: T;
}

class NodeItem<T> {
    public value: T;

    public prev: NodeItem<T>;

    public next: NodeItem<T>;

    constructor(value: T = null, prev: NodeItem<T> = null, next: NodeItem<T> = null) {
        this.value = value;
        this.prev = prev;
        this.next = next;
    }
}

class LinkedList<T> {
    public head: NodeItem<T>;

    public tail: NodeItem<T>;

    private len: number = 0;

    constructor() {
        this.head = null;
        this.tail = null;
        this.len = 0;
    }

    /**
     * Appends the specified value to the end of this linked list
     *
     * @param {NodeItem<T>} node node to be appended to this list
     */
    add(node: NodeItem<T>): void {
        node.prev = null;
        node.next = null;
        if (this.head == null) {
            this.head = node;
            this.tail = node;
        } else {
            this.tail.next = node;
            node.prev = this.tail;
            this.tail = node;
        }
        this.len++;
    }

    /**
     * Remove the specified node from this linked list
     *
     * @param {NodeItem<T>} node node node to be removed
     */
    remove(node: NodeItem<T>): void {
        const {prev, next} = node;
        if (prev == null) {
            this.head = next;
        } else {
            prev.next = next;
        }
        if (next == null) {
            this.tail = prev;
        } else {
            next.prev = prev;
        }
        node.next = null;
        node.prev = null;
        this.len--;
    }

    /**
     * Returns the number of elements in this linked list.
     *
     * @return {number} the number of elements
     */
    size(): number {
        return this.len;
    }

    /**
     * Removes all of the elements from this linked list.
     * The linked list will be empty after this call returns.
     */
    clear(): void {
        this.head = null;
        this.tail = null;
        this.len = 0;
    }
}

class LRU<T> {
    private linkedList: LinkedList<KeyValuePair<T>>;

    private map: Map<string, NodeItem<KeyValuePair<T>>>;

    private limit: number;

    constructor(limit: number = 10) {
        this.linkedList = new LinkedList<KeyValuePair<T>>();
        this.map = new Map();
        this.limit = limit;
    }

    /**
     * Returns true if this LRU contains a mapping for the specified key.
     *
     * @param {string} key the key whose presence in this LRU is to be tested
     * @return {boolean} true if this LRU contains a mapping for the specified key.
     */
    has(key: string): boolean {
        return this.map.has(key);
    }

    /**
     * Associates the specified value with the specified key in this LRU.
     * If the LRU previously contained a mapping for the key, the value is replaced and returned.
     * If the LRU size greater than or equal the limit, the oldest value is replaced and returned.
     *
     * @param {string} key with which the specified value is to be associated
     * @param {T} value value to be associated with the specified key
     * @return {T} the removed value, or null.
     */
    put(key: string, value: T): T {
        let removed: T = null;
        if (this.map.has(key)) {
            const node = this.map.get(key);
            removed = node.value.v;
            node.value.v = value;
            this.linkedList.remove(node);
            this.linkedList.add(node);
        } else {
            const node = new NodeItem({
                k: key,
                v: value
            });
            const size: number = this.linkedList.size();
            if (size >= this.limit && size > 0) {
                const leastUsedNode = this.linkedList.head;
                this.linkedList.remove(leastUsedNode);
                this.map.delete(leastUsedNode.value.k);
                removed = leastUsedNode.value.v;
            }
            this.map.set(key, node);
            this.linkedList.add(node);
        }
        return removed;
    }

    /**
     * Returns the value to which the specified key is mapped, or null if this LRU
     * contains no mapping for the key. A return value of null does not necessarily indicate
     * that the LRU contains no mapping for the key, it's also possible that the LRU
     * explicitly maps the key to null. The 'has' operation may be used to distinguish these two
     * cases.
     *
     * @param {string} key
     * @return {T}
     */
    get(key: string): T {
        const node = this.map.get(key);
        if (node == null) {
            return null;
        }
        if (node != this.linkedList.tail) {
            this.linkedList.remove(node);
            this.linkedList.add(node);
        }

        return node.value.v;
    }

    /**
     * Removes all of the mappings from this LRU. The LRU will be empty after this call returns.
     */
    clear(): void {
        this.linkedList.clear();
        this.map = new Map();
    }
}

export default LRU;
