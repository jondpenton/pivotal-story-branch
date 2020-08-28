#! /usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
require("dotenv").config();
async function bootstrap() {
    if (!process.env.TOKEN) {
        throw new Error("TOKEN env is required. It can be found here: https://www.pivotaltracker.com/profile");
    }
    await app_1.startApp();
}
bootstrap().catch((...args) => {
    console.error(...args);
    process.exit(1);
});
