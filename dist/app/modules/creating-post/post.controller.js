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
exports.postController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const post_service_1 = require("./post.service");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const addPostController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    const photoUrl = (_b = req.file) === null || _b === void 0 ? void 0 : _b.path;
    const payload = Object.assign(Object.assign({}, req.body), { photo: photoUrl });
    const result = yield post_service_1.postService.addPost(payload, token);
    (0, sendResponse_1.default)(res, {
        success: true,
        status: 200,
        message: 'Post Added successfully',
        data: result,
        statusCode: 200
    });
}));
const getAllMyPostsController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    const result = yield post_service_1.postService.getMyPostsByUserId(token);
    (0, sendResponse_1.default)(res, {
        success: true,
        status: 200,
        message: 'Posts retrived successfully',
        data: result,
        statusCode: 200
    });
}));
const addCommentController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { postId } = req.params;
    const { comments } = req.body;
    const text = comments[0].text;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    if (!token) {
        return (0, sendResponse_1.default)(res, {
            success: false,
            status: 401,
            message: "Unauthorized",
            data: null,
            statusCode: 401,
        });
    }
    const updatedPost = yield post_service_1.postService.addComment(postId, text, token);
    (0, sendResponse_1.default)(res, {
        success: true,
        status: 200,
        message: "Comment added successfully",
        data: updatedPost,
        statusCode: 200,
    });
}));
const editCommentController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { postId, commentId } = req.params;
    const { comments } = req.body;
    const text = comments[0].text;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    if (!token) {
        return (0, sendResponse_1.default)(res, {
            success: false,
            status: 401,
            message: "Unauthorized",
            data: null,
            statusCode: 401,
        });
    }
    const updatedComment = yield post_service_1.postService.EditComment(postId, commentId, text, token);
    (0, sendResponse_1.default)(res, {
        success: true,
        status: 200,
        message: "Comment updated successfully",
        data: updatedComment,
        statusCode: 200,
    });
}));
const getAllPostFromDB = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield post_service_1.postService.getAllPost();
        res.status(200).json({
            statusCode: 200,
            success: true,
            message: "Post retrived successfully",
            data: result,
        });
    }
    catch (err) {
        console.log(err);
    }
});
const getPaginatedPostsFromDB = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 1;
    const result = yield post_service_1.postService.getPaginatedPosts(page, pageSize);
    res.status(200).json({
        statusCode: 200,
        success: true,
        message: "Posts retrieved successfully",
        data: result.posts,
        pagination: {
            totalPosts: result.totalPosts,
            totalPages: result.totalPages,
            currentPage: result.currentPage,
            pageSize: result.pageSize
        }
    });
});
const deleteCommentController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { postId, commentId } = req.params;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    if (!token) {
        return (0, sendResponse_1.default)(res, {
            success: false,
            status: 401,
            message: "Unauthorized",
            data: null,
            statusCode: 401,
        });
    }
    const updatedPost = yield post_service_1.postService.deleteComment(postId, commentId, token);
    (0, sendResponse_1.default)(res, {
        success: true,
        status: 200,
        message: "Comment deleted successfully",
        data: updatedPost,
        statusCode: 200,
    });
}));
const deletePostController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const postId = req.params.postId;
        const result = yield post_service_1.postService.deletePost(postId);
        res.status(200).json({
            success: true,
            message: "Post deleted successfully",
            data: result
        });
    }
    catch (err) {
        console.log(err);
    }
});
const upvoteController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const postId = req.params.postId;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    const result = yield post_service_1.postService.upVotePost(postId, token);
    (0, sendResponse_1.default)(res, {
        success: true,
        status: 200,
        message: "Post upvoted successfully",
        statusCode: 200,
        data: result
    });
});
const downVoteController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const postId = req.params.postId;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    const result = yield post_service_1.postService.downvotePost(postId, token);
    (0, sendResponse_1.default)(res, {
        success: true,
        status: 200,
        message: "Post downvoted successfully",
        statusCode: 200,
        data: result
    });
});
const unPublishController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = req.params.postId;
    try {
        const unPublish = yield post_service_1.postService.unPublishPost(postId);
        res.status(200).json({
            success: true,
            message: "unPublished post successfully",
            data: unPublish,
        });
    }
    catch (err) {
        console.log(err);
    }
});
const PublishController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = req.params.postId;
    try {
        const Publish = yield post_service_1.postService.publishPost(postId);
        res.status(200).json({
            success: true,
            message: "Published post successfully",
            data: Publish,
        });
    }
    catch (err) {
        console.log(err);
    }
});
const searchProductsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm } = req.query;
    console.log(searchTerm);
    if (searchTerm) {
        try {
            const result = yield post_service_1.postService.searchPost(searchTerm);
            res.status(200).json({
                success: true,
                message: 'Search product',
                data: result
            });
        }
        catch (err) {
            res.status(500).json({
                success: false,
                message: " search something went wrong",
                error: err,
            });
        }
    }
});
exports.postController = {
    addPostController,
    getAllPostFromDB,
    addCommentController,
    editCommentController,
    deleteCommentController,
    deletePostController,
    upvoteController,
    downVoteController,
    unPublishController,
    PublishController,
    searchProductsController,
    getAllMyPostsController,
    getPaginatedPostsFromDB
};
