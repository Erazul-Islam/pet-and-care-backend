"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postValidation = void 0;
const zod_1 = require("zod");
const postValidationSchema = zod_1.z.object({
    postId: zod_1.z.string().optional(),
    description: zod_1.z.string().optional(),
    userEmail: zod_1.z.string().optional(),
    photo: zod_1.z.string().optional(),
    caption: zod_1.z.string().optional()
});
exports.postValidation = {
    postValidationSchema
};
