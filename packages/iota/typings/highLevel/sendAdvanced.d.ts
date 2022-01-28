import type { IClient } from "../models/IClient";
import type { IKeyPair } from "../models/IKeyPair";
import type { IMessage } from "../models/IMessage";
import type { IUTXOInput } from "../models/inputs/IUTXOInput";
import { ITransactionPayload } from "../models/payloads/ITransactionPayload";
/**
 * Send a transfer from the balance on the seed.
 * @param client The client or node endpoint to send the transfer with.
 * @param inputsAndSignatureKeyPairs The inputs with the signature key pairs needed to sign transfers.
 * @param outputs The outputs to send.
 * @param taggedData Optional tagged data to associate with the transaction.
 * @param taggedData.tag Optional tag.
 * @param taggedData.data Optional data.
 * @returns The id of the message created and the remainder address if one was needed.
 */
export declare function sendAdvanced(client: IClient | string, inputsAndSignatureKeyPairs: {
    input: IUTXOInput;
    addressKeyPair: IKeyPair;
}[], outputs: {
    address: string;
    addressType: number;
    amount: number;
}[], taggedData?: {
    tag?: Uint8Array | string;
    data?: Uint8Array | string;
}): Promise<{
    messageId: string;
    message: IMessage;
}>;
/**
 * Build a transaction payload.
 * @param inputsAndSignatureKeyPairs The inputs with the signature key pairs needed to sign transfers.
 * @param outputs The outputs to send.
 * @param taggedData Optional tagged data to associate with the transaction.
 * @param taggedData.tag Optional tag.
 * @param taggedData.data Optional index data.
 * @returns The transaction payload.
 */
export declare function buildTransactionPayload(inputsAndSignatureKeyPairs: {
    input: IUTXOInput;
    addressKeyPair: IKeyPair;
}[], outputs: {
    address: string;
    addressType: number;
    amount: number;
}[], taggedData?: {
    tag?: Uint8Array | string;
    data?: Uint8Array | string;
}): ITransactionPayload;