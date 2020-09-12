import { IProject } from './get-projects'
import { getStory } from './get-story'

const projects: IProject[] = [
  {
    id: 123,
    name: 'My cool project',
  },
]

it('gets a story', async () => {
  const storyId = 12345678

  const fetchedStory = await getStory({
    projects,
    storyId,
    token: '',
  })

  expect(fetchedStory).toMatchObject({ id: storyId })
})

it('throws an error if story not found', async () => {
  const storyId = 12345679

  await expect(getStory({ projects, storyId, token: '' })).rejects.toThrowError(
    'Unable to find story'
  )
})
