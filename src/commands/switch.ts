import { IConfig } from '@oclif/config'
import * as Parser from '@oclif/parser'
import { exec } from 'child_process'
import Ora from 'ora'
import { Command } from '../lib/command'
import { getStoryId } from '../lib/get-story-id'
import { runGenerate } from './generate'

class Switch extends Command {
  private spinner: Ora.Ora

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

  constructor(argv: string[], config: IConfig) {
    super(argv, config)

    this.spinner = Ora()
  }

  async switchToBranch({
    branch,
    newBranch = false,
    finalLog = true,
  }: {
    branch: string
    newBranch?: boolean
    finalLog?: boolean
  }) {
    if (newBranch) {
      this.spinner.start(`Creating branch ${branch}`)
    } else {
      this.spinner.start(`Switching to branch ${branch}`)
    }

    let baseCmd = 'git checkout'

    if (newBranch) {
      baseCmd += ' -b'
    }

    await new Promise((resolve, reject) => {
      exec(`${baseCmd} ${branch}`, async (error) => {
        if (error) {
          if (newBranch) {
            this.spinner.fail('Unable to create new branch')
            this.log(branch)
            reject()
            return
          }

          this.spinner.info(`Branch ${branch} doesn't exist.`)
          finalLog = false
          await this.switchToBranch({
            branch,
            newBranch: true,
          })
        }

        resolve()
      })
    })

    if (finalLog) {
      if (newBranch) {
        this.spinner.succeed(`Created branch ${branch}`)
      } else {
        this.spinner.succeed(`Switched to branch ${branch}`)
      }
    }
  }

  async run() {
    const { args } = this.parse(Switch)
    const { token } = await this.getConfig()

    if (!token) {
      throw new Error(
        `\`token\` is required in configuration. Set one using the 'config:set' command`
      )
    }

    const branch = await runGenerate({
      spinner: this.spinner,
      token,
      storyId: args.story_link,
    })

    await this.switchToBranch({ branch })
  }
}

export default Switch
