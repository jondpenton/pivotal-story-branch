import Ora from 'ora'
import { getProjects } from './lib/get-projects'
import { getStoryId } from './lib/get-story-id'

export async function startApp() {
  const spinner = Ora({
    text: 'Parsing story...',
  })

  const [, , linkOrId] = process.argv
  const storyId = getStoryId(linkOrId)

  spinner.succeed('Parsed story')
  spinner.start('Fetching projects...')

  const projects = await getProjects()

  spinner.succeed('Fetched projects')

  console.log(JSON.stringify({ storyId, projects }, null, 2))
}
