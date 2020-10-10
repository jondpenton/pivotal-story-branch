import { flags } from '@oclif/command'
import * as Parser from '@oclif/parser'
import Ora from 'ora'
import { interpret } from 'xstate'
import { Command } from '../lib/command'
import { getStoryId } from '../lib/get-story-id'
import { switchMachine } from '../machines/switch-machine'

class Switch extends Command {
  static description =
    'switches branch to generated Pivotal Tracker story branch'

  static args: Parser.args.Input = [
    {
      name: 'branch_or_story_link',
      description: 'Branch name or link to Pivotal Tracker story',
      required: true,
    },
  ]

  static flags = {
    baseBranch: flags.string({
      char: 'b',
      description: 'Branch used when creating a new branch',
    }),
  }

  async run() {
    const { args, flags } = this.parse(Switch)
    const config = await this.getConfig()
    const { token } = config
    let { baseBranch } = config

    if (!token) {
      throw new Error(
        `\`token\` is required in configuration. Set one using the 'config:set' command`
      )
    }

    if (!baseBranch) {
      baseBranch = flags.baseBranch
    }

    let branch: string | undefined
    let storyId: string | undefined

    try {
      storyId = getStoryId(args.branch_or_story_link)
    } catch (err) {
      branch = args.branch_or_story_link
    }

    interpret(
      switchMachine.withContext({
        spinner: Ora(),
        storyId,
        token,
        branch,
        baseBranch,
      })
    ).start()
  }
}

export default Switch
