import { IProject } from "./get-projects";
import axios from "axios";

export interface IStory {
  id: number;
  name: string;
  story_type: "feature" | "bug" | "chore" | "release";
}

export async function getStory(
  projects: IProject[],
  storyId: string
): Promise<IStory> {
  let story: IStory | undefined;

  for (const project of projects) {
    try {
      const response = await axios.get<IStory>(
        `https://www.pivotaltracker.com/services/v5/projects/${project.id}/stories/${storyId}`,
        {
          headers: {
            "X-TrackerToken": process.env.TOKEN,
          },
        }
      );
      story = response.data;
    } catch (err) {}
  }

  if (!story) {
    throw new Error("Unable to find story");
  }

  return story;
}
