"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventRoute = void 0;
const express_1 = __importDefault(require("express"));
const event_controller_1 = require("./event.controller");
const router = express_1.default.Router();
router.post('/create-event', event_controller_1.eventController.addEventController);
router.post('/create-interested/:eventId/interested', event_controller_1.eventController.interestedEventController);
router.patch('/ended-event/:eventId/ended', event_controller_1.eventController.EndEventController);
exports.eventRoute = router;
