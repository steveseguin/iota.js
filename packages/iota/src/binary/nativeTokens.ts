// Copyright 2020 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0
import type { ReadStream, WriteStream } from "@iota/util.js";
import bigInt from "big-integer";
import type { INativeToken } from "../models/INativeToken";
import { MIN_ALIAS_ADDRESS_LENGTH } from "./addresses/aliasAddress";
import { UINT16_SIZE, UINT32_SIZE, UINT8_SIZE } from "./commonDataTypes";

/**
 * The minimum length of a native tokens list.
 */
export const MIN_NATIVE_TOKENS_LENGTH: number = UINT16_SIZE;

/**
 * The length of a native token tag.
 */
export const NATIVE_TOKEN_TAG_LENGTH: number = 12;

/**
 * The length of a foundry id.
 */
export const FOUNDRY_ID_LENGTH: number = MIN_ALIAS_ADDRESS_LENGTH + UINT32_SIZE + UINT8_SIZE;

/**
 * The length of a native token id.
 */
export const NATIVE_TOKEN_ID_LENGTH: number = FOUNDRY_ID_LENGTH + NATIVE_TOKEN_TAG_LENGTH;

/**
 * Deserialize the natovetokens from binary.
 * @param readStream The stream to read the data from.
 * @returns The deserialized object.
 */
export function deserializeNativeTokens(readStream: ReadStream): INativeToken[] {
    const numNativeTokens = readStream.readUInt16("nativeTokens.numNativeTokens");
    const nativeTokens: INativeToken[] = [];

    for (let i = 0; i < numNativeTokens; i++) {
        nativeTokens.push(deserializeNativeToken(readStream));
    }

    return nativeTokens;
}

/**
 * Serialize the natove tokens to binary.
 * @param writeStream The stream to write the data to.
 * @param object The object to serialize.
 */
export function serializeNativeTokens(writeStream: WriteStream, object: INativeToken[]): void {
    writeStream.writeUInt16("nativeTokens.numNativeTokens", object.length);
    for (let i = 0; i < object.length; i++) {
        serializeNativeToken(writeStream, object[i]);
    }
}

/**
 * Deserialize the native token from binary.
 * @param readStream The stream to read the data from.
 * @returns The deserialized object.
 */
export function deserializeNativeToken(readStream: ReadStream): INativeToken {
    const id = readStream.readFixedHex("nativeToken.id", NATIVE_TOKEN_ID_LENGTH);
    const amount = readStream.readUInt256("nativeToken.amount");

    return {
        id,
        amount: amount.toString()
    };
}

/**
 * Serialize the native token to binary.
 * @param writeStream The stream to write the data to.
 * @param object The object to serialize.
 */
export function serializeNativeToken(writeStream: WriteStream, object: INativeToken): void {
    writeStream.writeFixedHex("nativeToken.id", NATIVE_TOKEN_ID_LENGTH, object.id);
    writeStream.writeUInt256("nativeToken.amount", bigInt(object.amount));
}