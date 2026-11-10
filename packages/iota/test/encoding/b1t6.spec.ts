// Copyright 2020 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0
import { B1T6 } from "../../src/encoding/b1t6";

describe("B1T6", () => {
    test("encoded length matches six trits per byte", () => {
        expect(B1T6.encodedLen(new Uint8Array())).toEqual(0);
        expect(B1T6.encodedLen(new Uint8Array([0]))).toEqual(6);
        expect(B1T6.encodedLen(new Uint8Array([127, 128]))).toEqual(12);
    });

    test("encodes every byte into a buffer sized by encodedLen", () => {
        const data = Uint8Array.from({ length: 256 }, (_, i) => i);
        const trits = new Int8Array(B1T6.encodedLen(data));
        expect(B1T6.encode(trits, 0, data)).toEqual(trits.length);
        for (let i = 0; i < data.length; i++) {
            let decoded = 0;
            for (let j = 0; j < 6; j++) {
                decoded += trits[i * 6 + j] * 3 ** j;
            }
            expect(decoded).toEqual(data[i] < 128 ? data[i] : data[i] - 256);
        }
    });

    test("preserves surrounding trits with a nonzero start index", () => {
        const data = new Uint8Array([127, 128]);
        const trits = new Int8Array(B1T6.encodedLen(data) + 4).fill(9);
        expect(B1T6.encode(trits, 2, data)).toEqual(12);
        expect(Array.from(trits)).toEqual([9, 9, 1, 0, -1, -1, -1, 1, 1, -1, 1, 1, 1, -1, 9, 9]);
    });
});
