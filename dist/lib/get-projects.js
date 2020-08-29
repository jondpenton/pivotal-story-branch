"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProjects = void 0;
const axios_1 = __importDefault(require("axios"));
async function getProjects() {
    const response = await axios_1.default.get("https://www.pivotaltracker.com/services/v5/projects", {
        headers: {
            "X-TrackerToken": process.env.PIVOTAL_TRACKER_TOKEN,
        },
    });
    return response.data;
}
exports.getProjects = getProjects;
