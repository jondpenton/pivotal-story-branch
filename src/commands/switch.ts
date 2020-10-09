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

  async run() {
    const { args } = this.parse(Switch)
    const { token } = await this.getConfig()

    if (!token) {
      throw new Error(
        `\`token\` is required in configuration. Set one using the 'config:set' command`
      )
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
      })
    ).start()
  }
}

export default Switch
