import { startApp } from "./app";

require("dotenv").config();

async function bootstrap() {
  if (!process.env.TOKEN) {
    throw new Error(
      "TOKEN env is required. It can be found here: https://www.pivotaltracker.com/profile"
    );
  }

  await startApp();
}

bootstrap().catch((...args) => {
  console.error(...args);
  process.exit(1);
});
