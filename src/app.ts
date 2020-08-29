import Ora from "ora";
import { getProjects } from "./lib/get-projects";
import { getStory } from "./lib/get-story";
import { getStoryId } from "./lib/get-story-id";
import { formatBranch } from "./lib/format-branch";

export async function startApp() {
  const spinner = Ora({
    text: "Parsing story...",
  });

  const [, , linkOrId] = process.argv;
  const storyId = getStoryId(linkOrId);

  spinner.succeed("Parsed story id");
  spinner.start("Fetching projects...");

  const projects = await getProjects();

  spinner.succeed("Fetched projects");
  spinner.start("Fetching story...");

  const story = await getStory(projects, storyId);

  spinner.succeed("Fetched story");

  const branch = formatBranch(story);

  console.log(branch);
}
