"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const router_1 = __importDefault(require("./app/routes/router"));
const globalErrorHandler_1 = __importDefault(require("./app/modules/middleware/globalErrorHandler"));
const notFound_1 = __importDefault(require("./app/modules/middleware/notFound"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use('/api', router_1.default);
console.log(process.cwd());
app.use(globalErrorHandler_1.default);
app.use(notFound_1.default);
console.log(process.cwd());
exports.default = app;
