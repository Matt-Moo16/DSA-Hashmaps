/* 
Hashing: This is the process of mapping a key to a position in the hash table.
Hash Table: A hash table is a storage that holds the records (the key and any value associated with the key).
Hash maps require a hash-table. The hash table is usually implemented internally using an array.
Each slot in the array holds a key-value pair or is empty (null).
Hash Function: A hash function maps keys to positions in the hash table. 
Imagine the word Pilfer and its meaning steal (typically things of relatively little value) is stored in a hashtable.
We want to find the meaning of Pilfer. Given Pilfer (the key) what if there was a way of jumping straight to the location where Pilfer is stored?
Then we would never have to search the whole dataset at all, we could just go to the location where Pilfer is stored and retrieve its value
(steal (typically things of relatively little value)). The has function is what gives us the mapping.
Given Pilfer to the hash function, it tells us a number and this number is then used as the index of the array (the hashtable) where Pilfer is stored. 
A good hash function satisfies (approximately) the assumption of uniform hashing, i.e, each key is equally likely to hash to any of the n number of slots, 
independently of where any other key has hashed to. A good hash function attempts to distribute the keys as evenly as possible among slots in the hash table.
*/

/* 
The constructor has an array called _hashTable which will hold all of the data and is considered the hash table.
The hash map has a length, as well as a capacity. The capacity will grow in chunks as you resize to larger array when the hash table is full. 
The MAX_LOAD_RATIO is the highest that the ratio between the length and the capacity will be allowed to reach. 
The _hashString function takes a string and hashes it, outputting a number. 
*/ 

/* 
Collisions: where two or more key objects produce the same final hash value and hence point to the same bucket location or array index.
There are generally 2 ways to resolve collisions.
The 1st is known as open addressing. In open addressing, when you have a collision, you hash the key to the empty slot nearest to where it should live.
The 2nd collision resolution mechanism uses linked lists to hash the keys that run into collision. The first slot contains the pointer to the head of the list. 
When a key collides with another, we use the next pointers to put the keys in a linked list. This is known as separate chaining.
*/

    class HashMap {
        constructor(initialCapacity=8) {
            this.length = 0;
            this._hashTable = [];
            this._capacity = initialCapacity;
            this._deleted = 0;
        }

        get(key) {
            const index = this.findSlot(key);
            if (this._hashTable[index] === undefined) {
                throw new Error('Key error');
            }
            return this._hashTable[index].value;
        }

        set(key, value) {
            // MAX_LOAD_RATIO keeps track of how full the hashmap is.
            // SIZE_RATIO so we reduce the number of collisions.
            const loadRatio = (this.length + this._deleted + 1) / this._capacity;
            if (loadRation > HashMap.MAX_LOAD_RATIO) {
                this._resize(this._capacity * HashMap.SIZE_RATIO);
            }
            // Find the slot where this key should be in
            const index = this._findSlot(key);
            if (!this._hashTable[index]) {
                this.length++;
            }
            this._hashTable[index] = {
                key, 
                value, 
                DELETED: false
            }
        }

        delete(key) {
            const index = this._findSlot(key);
            const slot = this._hashTable[index];
            if (slot === undefined) {
                throw new Error('Key error');
            }
            slot.DELETED = true;
            this.length--;
            this._deleted++;
        }

        // used to find the correct slot for a given key
        _findSlot(key) {
            // uses the function _hashString() to calculate the hash key, and then uses the modulus to find a slot for the key within the current capacity
            const hash = HashMap._hashString(key);
            const start = hash % this._capacity;
            // loops through the array and stops when it finds the slot with a matching key or an empty slot
            for (let i=start; i<start + this._capacity; i++) {
                const index = i % this._capacity;
                const slot = this.hashTable[index];
                if (slot === undefined || (slot.key === key && !slot.DELETED)) {
                    return index;
                }
            }
        }

        _resize(size) {
            const oldSlots = this._hashTable;
            this._capacity = size;
            // Reset the length - it will get rebuilt as you add the items back
            this.length = 0;
            this._deleted = 0;
            this._hashTable = [];
            for (const slot of oldSlots) {
                if (slot !== undefined && !slot.DELETED) {
                    this.set(slot.key, slot.value);
                }
            }
        }

        static _hashString(string) {
            let hash = 5381;
            for (let i = 0; i < string.length; i++) {
                // Bitwise left shift with 5 0s - this would be similar to 
                // hash*31, 31 being the decent prime number
                // but bit shifting is a faster way to do this
                //tradeoff is understandability
                hash = (hash << 5) + hash + string.charCodeAt(i);
                // converting hash to a 32 bit integer
                hash = hash & hash;
            }
            // making sure hash is unsigned - meaning non-negative number.
            return hash >>> 0;
        }
    }

