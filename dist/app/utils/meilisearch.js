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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMeiliSearch = exports.deleteDocumentFromIndex = void 0;
exports.addDocumentToIndex = addDocumentToIndex;
const meilisearch_1 = __importDefault(require("meilisearch"));
const config_1 = __importDefault(require("../config"));
const meiliClient = new meilisearch_1.default({
    host: config_1.default.meilisearch_Host,
    apiKey: config_1.default.meilisearch_api_key
});
function addDocumentToIndex(result, indexKey) {
    return __awaiter(this, void 0, void 0, function* () {
        const index = meiliClient.index(indexKey);
        const { _id, caption, description, photo, totalUpvotes } = result;
        const document = {
            id: _id.toString(),
            caption,
            description,
            thumbnail: photo,
            totalUpvotes
        };
        try {
            yield index.addDocuments([document]);
        }
        catch (error) {
            console.log(error);
        }
    });
}
const deleteDocumentFromIndex = (indexKey, id) => __awaiter(void 0, void 0, void 0, function* () {
    const index = meiliClient.index(indexKey);
    try {
        yield index.deleteDocument(id);
    }
    catch (error) {
        console.log(error);
    }
});
exports.deleteDocumentFromIndex = deleteDocumentFromIndex;
const deleteMeiliSearch = (indexKey) => __awaiter(void 0, void 0, void 0, function* () {
    meiliClient.deleteIndex(indexKey);
});
exports.deleteMeiliSearch = deleteMeiliSearch;
exports.default = meiliClient;
