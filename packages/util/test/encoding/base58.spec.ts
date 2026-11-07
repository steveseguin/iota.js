// Copyright 2020 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0
import { Base58 } from "../../src/encoding/base58";
import { Converter } from "../../src/utils/converter";
import testData from "./base58.json";

// Test vectors
// https://datatracker.ietf.org/doc/html/rfc4648#section-10
describe("Base58Helper", () => {
    test("Can encode base58 strings to bytes", () => {
        for (const test of testData) {
            expect(Base58.encode(Converter.hexToBytes(test.decoded))).toEqual(test.encoded);
        }
    });

    test("Can decode base58 bytes to string", () => {
        for (const test of testData) {
            expect(Converter.bytesToHex(Base58.decode(test.encoded))).toEqual(test.decoded);
        }
    });

    test("Can encode the long test vector without Node.js Buffer", () => {
        const vector = testData[testData.length - 1];
        const bytes = Converter.hexToBytes(vector.decoded);
        const encoded = withoutBuffer(() => Base58.encode(bytes));
        expect(encoded).toEqual(vector.encoded);
    });

    test("Can decode the long test vector without Node.js Buffer", () => {
        const vector = testData[testData.length - 1];
        const decoded = withoutBuffer(() => Base58.decode(vector.encoded));
        expect(Converter.bytesToHex(decoded)).toEqual(vector.decoded);
    });

    test("Can encode and decode all-zero bytes without Node.js Buffer", () => {
        const bytes = new Uint8Array(256);
        const encoded = withoutBuffer(() => Base58.encode(bytes));
        const decoded = withoutBuffer(() => Base58.decode(encoded));
        expect(encoded).toEqual("1".repeat(bytes.length));
        expect(decoded).toEqual(bytes);
    });
});

/**
 * Run an operation without the Node.js global that browsers do not provide.
 * @param operation The operation to run.
 * @returns The result of the operation.
 */
function withoutBuffer<T>(operation: () => T): T {
    const originalBuffer = global.Buffer;
    try {
        global.Buffer = undefined as unknown as typeof Buffer;
        return operation();
    } finally {
        global.Buffer = originalBuffer;
    }
}
