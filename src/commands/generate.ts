import { IConfig } from '@oclif/config'
import * as Parser from '@oclif/parser'
import Ora from 'ora'
import { Command } from '../lib/command'
import { formatBranch } from '../lib/format-branch'
import { getProjects } from '../lib/get-projects'
import { getStory } from '../lib/get-story'
import { getStoryId } from '../lib/get-story-id'

class Generate extends Command {
  private spinner: Ora.Ora

  static description = 'generates a branch name for a Pivotal Tracker story'

  static aliases = ['gen']

  static args: Parser.args.Input = [
    {
      name: 'story_link',
      description: 'Link to Pivotal Tracker story',
      required: true,
      parse: getStoryId,
    },
  ]

  constructor(argv: string[], config: IConfig) {
    super(argv, config)

    this.spinner = Ora()
  }

  async run() {
    const { args } = this.parse(Generate)
    this.spinner = Ora({
      text: 'Fetching projects...',
    })
    const { token } = await this.getConfig()

    if (!token) {
      throw new Error(
        `\`token\` is required in configuration. Set one using the 'config:set' command`
      )
    }

    const projects = await getProjects({ token })

    this.spinner.succeed('Fetched projects')
    this.spinner.start('Fetching story...')

    const story = await getStory({ token, projects, storyId: args.story_link })

    this.spinner.succeed('Fetched story')

    const branch = formatBranch(story)

    this.log(branch)
  }
}

export default Generate
