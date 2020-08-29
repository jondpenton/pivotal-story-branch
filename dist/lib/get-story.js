"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStory = void 0;
const axios_1 = __importDefault(require("axios"));
async function getStory(projects, storyId) {
    let story;
    for (const project of projects) {
        try {
            const response = await axios_1.default.get(`https://www.pivotaltracker.com/services/v5/projects/${project.id}/stories/${storyId}`, {
                headers: {
                    "X-TrackerToken": process.env.PIVOTAL_TRACKER_TOKEN,
                },
            });
            story = response.data;
        }
        catch (err) { }
    }
    if (!story) {
        throw new Error("Unable to find story");
    }
    return story;
}
exports.getStory = getStory;
