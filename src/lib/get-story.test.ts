import { server } from "../mocks/server";
import { rest } from "../mocks/handlers";
import { IStory, getStory } from "./get-story";
import { IProject } from "./get-projects";

const story: IStory = {
  id: 1,
  name: "Story name",
  story_type: "feature",
};
const projects: IProject[] = [
  {
    id: 123,
    name: "My cool project",
  },
];

beforeEach(() => {
  server.use(
    rest.get(
      "https://www.pivotaltracker.com/services/v5/projects/123/stories/12345678",
      (_req, res, ctx) => res(ctx.json(story))
    )
  );
});

it("gets a story", async () => {
  const fetchedStory = await getStory(projects, "12345678");

  expect(fetchedStory).toMatchObject(story);
});

it("throws an error if story not found", async () => {
  await expect(getStory(projects, "12345679")).rejects.toThrowError(
    "Unable to find story"
  );
});
