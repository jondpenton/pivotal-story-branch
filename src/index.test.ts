import PivotalStoryBranch from '.'
import { IProject } from './lib/get-projects'
import { IStory } from './lib/get-story'
import { rest, server } from './mocks/server'

it(`doesn't throw an error when given a valid link`, async () => {
  const link = 'https://www.pivotaltracker.com/story/show/12345678'
  server.use(
    rest.get(
      'https://www.pivotaltracker.com/services/v5/projects',
      (_req, res, ctx) =>
        res(
          ctx.json([
            {
              id: 123,
              name: 'Some project',
            },
          ] as IProject[])
        )
    ),
    rest.get(
      'https://www.pivotaltracker.com/services/v5/projects/123/stories/12345678',
      (_req, res, ctx) =>
        res(
          ctx.json({
            id: 1,
            name: 'Story name',
            story_type: 'feature',
          } as IStory)
        )
    )
  )

  await expect(PivotalStoryBranch.run([link])).resolves.toBeUndefined()
})
