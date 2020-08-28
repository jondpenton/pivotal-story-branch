"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStoryId = void 0;
function getStoryId(linkOrId) {
    var _a, _b;
    const linkRegex = /^https?:\/\/www\.pivotaltracker\.com\/story\/show\/(?<storyId>\d+)$/;
    const linkResult = linkRegex.exec(linkOrId);
    if ((_a = linkResult === null || linkResult === void 0 ? void 0 : linkResult.groups) === null || _a === void 0 ? void 0 : _a['storyId']) {
        return linkResult.groups['storyId'];
    }
    const idRegex = /^#(?<storyId>\d+)$/;
    const idResult = idRegex.exec(linkOrId);
    if ((_b = idResult === null || idResult === void 0 ? void 0 : idResult.groups) === null || _b === void 0 ? void 0 : _b['storyId']) {
        return idResult.groups['storyId'];
    }
    throw new Error('Unable to parse story id');
}
exports.getStoryId = getStoryId;
