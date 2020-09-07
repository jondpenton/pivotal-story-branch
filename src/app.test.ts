import { server, rest } from "./mocks/server";
import { IProject } from "./lib/get-projects";
import { IStory } from "./lib/get-story";
import { startApp } from "./app";

const projects: IProject[] = [
  {
    id: 123,
    name: "Some project",
  },
  {
    id: 124,
    name: "Another one",
  },
];
const story: IStory = {
  id: 1,
  name: "Story name",
  story_type: "feature",
};

it(`doesn't throw an error when expected responses are found`, async () => {
  server.use(
    rest.get(
      "https://www.pivotaltracker.com/services/v5/projects",
      (_req, res, ctx) => res(ctx.json(projects))
    ),
    rest.get(
      "https://www.pivotaltracker.com/services/v5/projects/124/stories/12345678",
      (_req, res, ctx) => res(ctx.json(story))
    )
  );
  const link = "https://www.pivotaltracker.com/story/show/12345678";

  await expect(startApp(link)).resolves.toBeUndefined();
});
