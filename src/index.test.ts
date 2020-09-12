import PivotalStoryBranch from '.'

it(`doesn't throw an error when given a valid link`, async () => {
  const link = 'https://www.pivotaltracker.com/story/show/12345678'

  await expect(PivotalStoryBranch.run([link])).resolves.toBeUndefined()
})
