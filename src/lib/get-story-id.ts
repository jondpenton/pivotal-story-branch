export function getStoryId(linkOrId: string): string {
  const linkRegex = /^https?:\/\/www\.pivotaltracker\.com\/story\/show\/(?<storyId>\d+)$/
  const linkResult = linkRegex.exec(linkOrId)

  if (linkResult?.groups?.['storyId']) {
    return linkResult.groups['storyId']
  }

  const idRegex = /^#(?<storyId>\d+)$/
  const idResult = idRegex.exec(linkOrId)

  if (idResult?.groups?.['storyId']) {
    return idResult.groups['storyId']
  }

  throw new Error('Unable to parse story id')
}
