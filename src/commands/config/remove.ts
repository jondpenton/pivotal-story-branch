import Command from '@oclif/command'
import { promises as fs } from 'fs'
import path from 'path'
import * as Parser from '@oclif/parser'

interface IUserConfig {
  [key: string]: string | undefined
  token?: string
}

class RemoveConfig extends Command {
  static description = 'Removes a key from the configuration'

  static args: Parser.args.Input = [
    {
      name: 'key',
      required: true,
      description: 'Key to remove from configuration',
    },
  ]

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

  async run() {
    const {
      args: { key },
    } = this.parse(RemoveConfig)
    const config = await this.getConfig()
    delete config[key]
    const configPath = this.getConfigPath()

    await fs.writeFile(configPath, JSON.stringify(config))
  }
}

export default RemoveConfig
