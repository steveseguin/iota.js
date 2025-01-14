// Copyright 2020 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0
/* eslint-disable no-bitwise */
/**
 * This is a port of the Go code from https://github.com/hdevalence/ed25519consensus
 * which is an extension of https://github.com/golang/crypto/tree/master/ed25519
 * which in a port of the “ref10” implementation of ed25519 from SUPERCOP.
 */
import { Sha512 } from "../hashes/sha512";
import { Ed25519 } from "./ed25519";
import { ExtendedGroupElement } from "./edwards25519/extendedGroupElement";
import { ProjectiveGroupElement } from "./edwards25519/projectiveGroupElement";
import { scalarMinimal, scalarReduce } from "./edwards25519/scalar";
/**
 * Implementation of Zip215.
 */
export class Zip215 {
    /**
     * Verify reports whether sig is a valid signature of message by
     * publicKey, using precisely-specified validation criteria (ZIP 215) suitable
     * for use in consensus-critical contexts.
     * @param publicKey The public key for the message.
     * @param message The message content to validate.
     * @param sig The signature to verify.
     * @returns True if the signature is valid.
     */
    static verify(publicKey, message, sig) {
        if (!publicKey || publicKey.length !== Ed25519.PUBLIC_KEY_SIZE) {
            return false;
        }
        if (!sig || sig.length !== Ed25519.SIGNATURE_SIZE || (sig[63] & 224) !== 0) {
            return false;
        }
        const A = new ExtendedGroupElement();
        // ZIP215: this works because FromBytes does not check that encodings are canonical.
        if (!A.fromBytes(publicKey)) {
            return false;
        }
        A.X.neg();
        A.T.neg();
        const h = new Sha512();
        h.update(sig.subarray(0, 32));
        h.update(publicKey);
        h.update(message);
        const digest = h.digest();
        const hReduced = new Uint8Array(32);
        scalarReduce(hReduced, digest);
        const r = new Uint8Array(sig.subarray(0, 32));
        const checkR = new ExtendedGroupElement();
        // ZIP215: this works because FromBytes does not check that encodings are canonical.
        if (!checkR.fromBytes(r)) {
            return false;
        }
        const s = new Uint8Array(sig.subarray(32));
        // https://tools.ietf.org/html/rfc8032#section-5.1.7 requires that s be in
        // the range [0, order) in order to prevent signature malleability.
        // ZIP215: This is also required by ZIP215.
        if (!scalarMinimal(s)) {
            return false;
        }
        const rProj = new ProjectiveGroupElement();
        const R = new ExtendedGroupElement();
        rProj.doubleScalarMultVartime(hReduced, A, s);
        rProj.toExtended(R);
        // ZIP215: We want to check [8](R - R') == 0
        return R.cofactorEqual(checkR);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiemlwMjE1LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3NpZ25hdHVyZXMvemlwMjE1LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLCtCQUErQjtBQUMvQixzQ0FBc0M7QUFDdEMsK0JBQStCO0FBQy9COzs7O0dBSUc7QUFDSCxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFDMUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLFdBQVcsQ0FBQztBQUNwQyxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSxxQ0FBcUMsQ0FBQztBQUMzRSxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSx1Q0FBdUMsQ0FBQztBQUMvRSxPQUFPLEVBQUUsYUFBYSxFQUFFLFlBQVksRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBRXBFOztHQUVHO0FBQ0gsTUFBTSxPQUFPLE1BQU07SUFDZjs7Ozs7Ozs7T0FRRztJQUNJLE1BQU0sQ0FBQyxNQUFNLENBQUMsU0FBcUIsRUFBRSxPQUFtQixFQUFFLEdBQWU7UUFDNUUsSUFBSSxDQUFDLFNBQVMsSUFBSSxTQUFTLENBQUMsTUFBTSxLQUFLLE9BQU8sQ0FBQyxlQUFlLEVBQUU7WUFDNUQsT0FBTyxLQUFLLENBQUM7U0FDaEI7UUFFRCxJQUFJLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxNQUFNLEtBQUssT0FBTyxDQUFDLGNBQWMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDeEUsT0FBTyxLQUFLLENBQUM7U0FDaEI7UUFFRCxNQUFNLENBQUMsR0FBRyxJQUFJLG9CQUFvQixFQUFFLENBQUM7UUFFckMsb0ZBQW9GO1FBQ3BGLElBQUksQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxFQUFFO1lBQ3pCLE9BQU8sS0FBSyxDQUFDO1NBQ2hCO1FBQ0QsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUNWLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7UUFFVixNQUFNLENBQUMsR0FBRyxJQUFJLE1BQU0sRUFBRSxDQUFDO1FBQ3ZCLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUM5QixDQUFDLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3BCLENBQUMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFbEIsTUFBTSxNQUFNLEdBQUcsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBRTFCLE1BQU0sUUFBUSxHQUFHLElBQUksVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3BDLFlBQVksQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFFL0IsTUFBTSxDQUFDLEdBQUcsSUFBSSxVQUFVLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUU5QyxNQUFNLE1BQU0sR0FBRyxJQUFJLG9CQUFvQixFQUFFLENBQUM7UUFDMUMsb0ZBQW9GO1FBQ3BGLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQ3RCLE9BQU8sS0FBSyxDQUFDO1NBQ2hCO1FBRUQsTUFBTSxDQUFDLEdBQUcsSUFBSSxVQUFVLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQzNDLDBFQUEwRTtRQUMxRSxtRUFBbUU7UUFDbkUsMkNBQTJDO1FBQzNDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDbkIsT0FBTyxLQUFLLENBQUM7U0FDaEI7UUFFRCxNQUFNLEtBQUssR0FBRyxJQUFJLHNCQUFzQixFQUFFLENBQUM7UUFDM0MsTUFBTSxDQUFDLEdBQUcsSUFBSSxvQkFBb0IsRUFBRSxDQUFDO1FBRXJDLEtBQUssQ0FBQyx1QkFBdUIsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQzlDLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFcEIsNENBQTRDO1FBQzVDLE9BQU8sQ0FBQyxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNuQyxDQUFDO0NBQ0oifQ==