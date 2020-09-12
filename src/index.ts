import { Command, flags } from '@oclif/command'
import * as Parser from '@oclif/parser'
import { getStoryId } from './lib/get-story-id'
import Ora from 'ora'
import { getProjects } from './lib/get-projects'
import { getStory } from './lib/get-story'
import { formatBranch } from './lib/format-branch'

class PivotalStoryBranch extends Command {
  static description = 'Generates a git branch name for a Pivotal Tracker story'

  static flags = {
    // add --version flag to show CLI version
    version: flags.version({ char: 'v' }),
    help: flags.help({ char: 'h' }),
  }

  static args: Parser.args.Input = [
    {
      name: 'story_link',
      parse(input) {
        const storyId = getStoryId(input)

        return storyId
      },
      required: true,
    },
  ]

  async run() {
    const { args } = this.parse(PivotalStoryBranch)
    const spinner = Ora({
      text: 'Fetching projects...',
    })
    const projects = await getProjects()

    spinner.succeed('Fetched projects')
    spinner.start('Fetching story...')

    const story = await getStory(projects, args.story_link)

    spinner.succeed('Fetched story')

    const branch = formatBranch(story)

    this.log(branch)
  }
}

export default PivotalStoryBranch
