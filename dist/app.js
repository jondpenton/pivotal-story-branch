"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startApp = void 0;
const ora_1 = __importDefault(require("ora"));
const get_projects_1 = require("./lib/get-projects");
const get_story_1 = require("./lib/get-story");
const get_story_id_1 = require("./lib/get-story-id");
const format_branch_1 = require("./lib/format-branch");
async function startApp() {
    const spinner = ora_1.default({
        text: "Parsing story...",
    });
    const [, , linkOrId] = process.argv;
    const storyId = get_story_id_1.getStoryId(linkOrId);
    spinner.succeed("Parsed story id");
    spinner.start("Fetching projects...");
    const projects = await get_projects_1.getProjects();
    spinner.succeed("Fetched projects");
    spinner.start("Fetching story...");
    const story = await get_story_1.getStory(projects, storyId);
    spinner.succeed("Fetched story");
    const branch = format_branch_1.formatBranch(story);
    console.log(branch);
}
exports.startApp = startApp;
