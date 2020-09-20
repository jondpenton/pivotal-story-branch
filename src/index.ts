import { Command, flags } from '@oclif/command'
import { IConfig } from '@oclif/config'
import * as Parser from '@oclif/parser'
import { promises as fs } from 'fs'
import Ora from 'ora'
import * as path from 'path'
import { formatBranch } from './lib/format-branch'
import { getProjects } from './lib/get-projects'
import { getStory } from './lib/get-story'
import { getStoryId } from './lib/get-story-id'

interface IUserConfig {
  token?: string
}

class PivotalStoryBranch extends Command {
  private spinner: Ora.Ora

  static description = 'Generates a git branch name for a Pivotal Tracker story'

  static flags = {
    version: flags.version({ char: 'v' }),
    help: flags.help({ char: 'h' }),
    token: flags.string({
      char: 't',
      description:
        'Token used for requests to Pivotal Tracker. This value will be saved for further use',
    }),
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

  constructor(argv: string[], config: IConfig) {
    super(argv, config)

    this.spinner = Ora()
  }

  async getConfig() {
    try {
      await fs.readdir(this.config.configDir)
    } catch (err) {
      await fs.mkdir(this.config.configDir, { recursive: true })
    }

    const configPath = this.getConfigPath()
    let userConfig: IUserConfig

    try {
      const rawUserConfig = await fs.readFile(configPath)
      userConfig = JSON.parse(rawUserConfig.toString())
    } catch (err) {
      userConfig = {}
    }

    return userConfig
  }

  getConfigPath() {
    return path.join(this.config.configDir, './config.json')
  }

  async updateToken(token: string) {
    const userConfig = await this.getConfig()

    userConfig.token = token

    const configPath = this.getConfigPath()

    await fs.writeFile(configPath, JSON.stringify(userConfig))
  }

  async run() {
    const { args, flags } = this.parse(PivotalStoryBranch)
    this.spinner = Ora({
      text: 'Fetching projects...',
    })
    let token: string | undefined = process.env.PIVOTAL_TRACKER_TOKEN

    if (!token) {
      if (flags.token) {
        await this.updateToken(flags.token)
        token = flags.token
      } else {
        const config = await this.getConfig()

        if (config.token) {
          token = config.token
        } else if (!token) {
          throw new Error(
            'Unable to find token. It should be passed in through the token flag (--token) or the PIVOTAL_TRACKER_TOKEN environment variable.'
          )
        }
      }
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

export default PivotalStoryBranch
