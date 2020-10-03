export { run } from '@oclif/command'

// class PivotalStoryBranch extends Command {

//   static flags = {
//     version: flags.version({ char: 'v' }),
//     help: flags.help({ char: 'h' }),
//     switch: flags.boolean({
//       char: 's',
//       description: 'Automatically switches to branch',
//     }),
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
