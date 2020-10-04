import Command from '@oclif/command'
import { promises as fs } from 'fs'
import path from 'path'
import * as Parser from '@oclif/parser'

interface IUserConfig {
  [key: string]: string | undefined
  token?: string
}

class SetConfig extends Command {
  static description = 'Sets a value in the configuration'

  static args: Parser.args.Input = [
    {
      name: 'key',
      required: true,
      description: 'Key the value is set under in configuration',
    },
    {
      name: 'value',
      required: true,
      description: 'Value that is set under key in configuration',
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
      args: { key, value },
    } = this.parse(SetConfig)
    const config = await this.getConfig()
    config[key] = value

    const configPath = this.getConfigPath()

    await fs.writeFile(configPath, JSON.stringify(config))
  }
}

export default SetConfig
