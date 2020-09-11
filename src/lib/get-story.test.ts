import { server, rest } from "../mocks/server";
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
let originalToken = process.env.PIVOTAL_TRACKER_TOKEN;

beforeAll(() => {
  process.env.PIVOTAL_TRACKER_TOKEN = "1234-1234-1234";
});

beforeEach(() => {
  server.use(
    rest.get(
      "https://www.pivotaltracker.com/services/v5/projects/123/stories/12345678",
      (_req, res, ctx) => res(ctx.json(story))
    )
  );
});

afterAll(() => {
  process.env.PIVOTAL_TRACKER_TOKEN = originalToken;
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
