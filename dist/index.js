#!/usr/bin/env node
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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var admin = require("firebase-admin");
var fs = require("fs-extra");
var args = require("commander");
args
    .version("1.0.0")
    .option("-s, --src <path>", "Source file path")
    .option("-c, --collection <path>", "collection path in db")
    .option("-i, --id [id]", "document ID (optional)")
    .parse(process.argv);
var serviceAccount = require("../creds.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});
var db = admin.firestore();
var migrate = function () { return __awaiter(void 0, void 0, void 0, function () {
    var collection, file, collectionRef, data, i, docData, _i, data_1, document, id, timeStamp, docRef, k, batch, j, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                collection = args.collection;
                file = args.src;
                if (!collection || !file) {
                    console.log("invalid args");
                    return [2 /*return*/];
                }
                collectionRef = db.collection(collection);
                return [4 /*yield*/, fs.readJSON(file)];
            case 1:
                data = _a.sent();
                i = 0;
                docData = [];
                for (_i = 0, data_1 = data; _i < data_1.length; _i++) {
                    document = data_1[_i];
                    id = collectionRef.doc().id;
                    if ("Fecha" in document) {
                        timeStamp = admin.firestore.Timestamp.fromDate(new Date(document.Fecha));
                        document.Fecha = timeStamp;
                    }
                    docRef = collectionRef.doc(id);
                    docData.push({ docRef: docRef, document: document });
                }
                console.log("loaded documents into cache");
                k = 0;
                _a.label = 2;
            case 2:
                if (!(k < docData.length)) return [3 /*break*/, 4];
                console.log("starting batch on document " + k);
                batch = db.batch();
                j = 0;
                while (j < 300 && k < docData.length) {
                    batch.set(docData[k].docRef, docData[k].document);
                    j++;
                    k++;
                }
                return [4 /*yield*/, batch.commit()];
            case 3:
                _a.sent();
                return [3 /*break*/, 2];
            case 4: return [3 /*break*/, 6];
            case 5:
                err_1 = _a.sent();
                console.log("Migration error: " + err_1.message);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
//run
migrate();
//# sourceMappingURL=index.js.map