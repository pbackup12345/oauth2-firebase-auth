"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.garbageCollection = void 0;
const functions = require("firebase-functions");
const admin = require("firebase-admin");
function garbageCollection(expiry = 86400, interval = "every 1 hours") {
    return functions.pubsub.schedule(interval).onRun(() => __awaiter(this, void 0, void 0, function* () {
        const db = admin.firestore();
        const now = new Date().getTime();
        const threshold = now - expiry;
        const oldTokens = yield db
            .collection("oauth2_access_tokens")
            .where("created_on", "<=", threshold)
            .get();
        oldTokens.forEach((tokenSnapshot) => __awaiter(this, void 0, void 0, function* () {
            const data = tokenSnapshot.data();
            if (now > data.created_on + data.expires_in) {
                yield db
                    .collection("oauth2_access_tokens")
                    .doc(tokenSnapshot.id)
                    .delete();
            }
        }));
    }));
}
exports.garbageCollection = garbageCollection;
//# sourceMappingURL=garbage-collection.js.map