/**
 * @file A finite key-value map using the Least Recently Used(LRU) algorithm, where the most
 * recently-used items are "kept alive" while older, less recently-used items are evicted to
 * make room for newer items.
 */

class Node {
    constructor(value = null, prev = null, next = null) {
        this.value = value;
        this.prev = prev;
        this.next = next;
    }
}

class LinkedList {
    constructor() {
        this.head = null;
        this.tail = null;
        this._len = 0;
    }

    /**
     * Appends the specified value to the end of this linked list
     * @param {*} node node to be appended to this list
     */
    add(node) {
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
        this._len++;
    }

    /**
     * Remove the specified node from this linked list
     * @param {Node} node node to be removed
     */
    remove(node) {
        const prev = node.prev;
        const next = node.next;
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
        this._len--;
    }

    /**
     * Returns the number of elements in this linked list.
     * @return {number} the number of elements
     */
    size() {
        return this._len;
    }

    /**
     * Removes all of the elements from this linked list.
     * The linked list will be empty after this call returns.
     */
    clear() {
        this.head = null;
        this.tail = null;
        this._len = 0;
    }
}

class LRU {
    constructor(limit = 10) {
        this._linkedList = new LinkedList();
        this._map = new Map();
        this._limit = limit;
    }

    /**
     * Returns true if this map contains a mapping for the specified key.
     * @param {string} key the key whose presence in this map is to be tested
     * @returns {boolean} true if this map contains a mapping for the specified key.
     */
    has(key) {
        return this._map.has(key);
    }

    /**
     * Associates the specified value with the specified key in this map.
     * If the map previously contained a mapping for the key, the old value is replaced and returned.
     * If the map size greater than or equal the limit, the oldest value is replaced and returned.
     *
     * @param {string} key with which the specified value is to be associated
     * @param {*} value value to be associated with the specified key
     * @return {*} the removed value, or null if there was no mapping for key.
     */
    put(key, value) {
        const {_linkedList: linkedList, _map: map} = this;
        let removed = null;
        if (map.has(key)) {
            const node = map.get(key);
            removed = node.value;
            node.value = value;
            linkedList.remove(node);
            linkedList.add(node);
        } else {
            const node = new Node(value);
            node.key = key;
            const size = linkedList.size();
            if (size >= this._limit && size > 0) {
                const leastUsedNode = linkedList.head;
                linkedList.remove(leastUsedNode);
                map.delete(leastUsedNode.key);
                removed = leastUsedNode.value;
            }
            map.set(key, node);
            linkedList.add(node);
        }
        return removed;
    }

    /**
     * Returns the value to which the specified key is mapped, or null if this map
     * contains no mapping for the key. A return value of null does not necessarily indicate
     * that the map contains no mapping for the key, it's also possible that the map
     * explicitly maps the key to null. The 'has' operation may be used to distinguish these two
     * cases.
     * @param {string} key the key whose associated value is to be returned
     * @returns the value to which the specified key is mapped, or null if there was no mapping for key.
     */
    get(key) {
        const {_linkedList: linkedList, _map: map} = this;

        const node = map.get(key);
        if (node == null) {
            return null;
        }
        if (node != linkedList.tail) {
            linkedList.remove(node);
            linkedList.add(node);
        }
        return node.value;
    }

    /**
     * Removes all of the mappings from this map. The map will be empty after this call returns.
     */
    clear() {
        this._linkedList.clear();
        this._map = new Map();
    }
}

export default LRU;
