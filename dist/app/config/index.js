"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join((process.cwd(), '.env')) });
exports.default = {
    port: process.env.PORT,
    DATABASE_URL: process.env.DATABASE_URL,
    bcrypt_salt_rounds: process.env.bcrypt_salt_rounds,
    jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
    jwtRefressSecret: process.env.JWT_Refress_SECRET,
    JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN,
    JWT_REFRESS_EXPIRES_IN: process.env.JWT_REFRESS_EXPIRES_IN,
    meilisearch_Host: process.env.meilisearch_host,
    meilisearch_api_key: process.env.meilisearch_api_key,
    nodeEnv: process.env.NODE_ENV,
    reset_link: process.env.reset_Link
};
