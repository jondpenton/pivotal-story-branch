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
      name: 'story_link',
      description: 'Link to Pivotal Tracker story',
      required: true,
      parse: getStoryId,
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

    interpret(
      switchMachine.withContext({
        spinner: Ora(),
        storyId: args.story_link,
        token,
      })
    ).start()
  }
}

export default Switch
