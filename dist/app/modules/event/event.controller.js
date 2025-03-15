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
exports.eventController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const event_service_1 = require("./event.service");
const addEventController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    const result = yield event_service_1.eventService.createEvent(req.body, token);
    console.log(result);
    (0, sendResponse_1.default)(res, {
        success: true,
        status: 200,
        message: 'Event Added successfully',
        data: result,
        statusCode: 200
    });
}));
const interestedEventController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { eventId } = req.params;
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
    const interestedEvent = yield event_service_1.eventService.interestedEvent(eventId, token);
    (0, sendResponse_1.default)(res, {
        success: true,
        status: 200,
        message: "Interested the event",
        data: interestedEvent,
        statusCode: 200,
    });
}));
const EndEventController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { eventId } = req.params;
    const endEvent = yield event_service_1.eventService.endEvent(eventId);
    (0, sendResponse_1.default)(res, {
        success: true,
        status: 200,
        message: "The event ended",
        data: endEvent,
        statusCode: 200,
    });
}));
exports.eventController = {
    addEventController,
    interestedEventController,
    EndEventController
};
