export { run } from '@oclif/command'

// import { Command, flags } from '@oclif/command'
// import { IConfig } from '@oclif/config'
// import * as Parser from '@oclif/parser'
// import { exec } from 'child_process'
// import { promises as fs } from 'fs'
// import Ora from 'ora'
// import * as path from 'path'
// import { formatBranch } from './lib/format-branch'
// import { getProjects } from './lib/get-projects'
// import { getStory } from './lib/get-story'
// import { getStoryId } from './lib/get-story-id'

// class PivotalStoryBranch extends Command {
//   private spinner: Ora.Ora

//   static description = 'Generates a git branch name for a Pivotal Tracker story'

//   static flags = {
//     version: flags.version({ char: 'v' }),
//     help: flags.help({ char: 'h' }),
//     token: flags.string({
//       char: 't',
//       description:
//         'Token used for requests to Pivotal Tracker. This value will be saved for further use',
//     }),
//     switch: flags.boolean({
//       char: 's',
//       description: 'Automatically switches to branch',
//     }),
//   }

//   static args: Parser.args.Input = [
//     {
//       name: 'story_link',
//       parse(input) {
//         const storyId = getStoryId(input)

//         return storyId
//       },
//       required: true,
//     },
//   ]

//   constructor(argv: string[], config: IConfig) {
//     super(argv, config)

//     this.spinner = Ora()
//   }

//   async updateToken(token: string) {
//     const userConfig = await this.getConfig()

//     userConfig.token = token

//     const configPath = this.getConfigPath()

//     await fs.writeFile(configPath, JSON.stringify(userConfig))
//   }

//   async run() {
//     const { args, flags } = this.parse(PivotalStoryBranch)
//     this.spinner = Ora({
//       text: 'Fetching projects...',
//     })
//     let token: string | undefined = process.env.PIVOTAL_TRACKER_TOKEN

//     if (!token) {
//       if (flags.token) {
//         await this.updateToken(flags.token)
//         token = flags.token
//       } else {
//         const config = await this.getConfig()

//         if (config.token) {
//           token = config.token
//         } else if (!token) {
//           throw new Error(
//             'Unable to find token. It should be passed in through the token flag (--token) or the PIVOTAL_TRACKER_TOKEN environment variable.'
//           )
//         }
//       }
//     }

//     const projects = await getProjects({ token })

//     this.spinner.succeed('Fetched projects')
//     this.spinner.start('Fetching story...')

//     const story = await getStory({ token, projects, storyId: args.story_link })

//     this.spinner.succeed('Fetched story')

//     const branch = formatBranch(story)

//     if (flags.switch) {
//       await this.switchToBranch({ branch })
//     } else {
//       this.log(branch)
//     }
//   }

//   async switchToBranch({
//     branch,
//     newBranch = false,
//     finalLog = true,
//   }: {
//     branch: string
//     newBranch?: boolean
//     finalLog?: boolean
//   }) {
//     if (newBranch) {
//       this.spinner.start(`Creating branch ${branch}`)
//     } else {
//       this.spinner.start(`Switching to branch ${branch}`)
//     }

//     let baseCmd = 'git checkout'

//     if (newBranch) {
//       baseCmd += ' -b'
//     }

//     await new Promise((resolve, reject) => {
//       exec(`${baseCmd} ${branch}`, async (error) => {
//         if (error) {
//           if (newBranch) {
//             this.spinner.fail('Unable to create new branch')
//             this.log(branch)
//             reject()
//             return
//           }

//           this.spinner.info(`Branch ${branch} doesn't exist.`)
//           finalLog = false
//           await this.switchToBranch({
//             branch,
//             newBranch: true,
//           })
//         }

//         resolve()
//       })
//     })

//     if (finalLog) {
//       if (newBranch) {
//         this.spinner.succeed(`Created branch ${branch}`)
//       } else {
//         this.spinner.succeed(`Switched to branch ${branch}`)
//       }
//     }
//   }
// }

// export default PivotalStoryBranch
