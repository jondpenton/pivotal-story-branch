"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatBranch = void 0;
const slugify_1 = __importDefault(require("slugify"));
function formatBranch(story) {
    const characterLimit = process.env.PIVOTAL_TRACKER_BRANCH_MAX_LENGTH
        ? parseInt(process.env.PIVOTAL_TRACKER_BRANCH_MAX_LENGTH, 10)
        : 50;
    const baseLength = `${story.story_type}/`.length + `-#${story.id}`.length;
    const remainingLength = characterLimit - baseLength;
    const nameSlug = slugify_1.default(story.name.trim(), {
        lower: true,
    });
    if (nameSlug.length <= remainingLength) {
        return `${story.story_type}/${nameSlug}-#${story.id}`;
    }
    const nameWords = nameSlug.split("-");
    const usedWords = [nameWords[0]];
    for (const word of nameWords.slice(1)) {
        if ([...usedWords, word].join("-").length > remainingLength) {
            break;
        }
        usedWords.push(word);
    }
    return `${story.story_type}/${usedWords.join("-")}-#${story.id}`;
}
exports.formatBranch = formatBranch;
