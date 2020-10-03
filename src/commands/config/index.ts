import Command from '@oclif/command'
import { promises as fs } from 'fs'
import path from 'path'

interface IUserConfig {
  token?: string
}

class Config extends Command {
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
    const config = await this.getConfig()

    this.log('Configuration:')
    this.log(JSON.stringify(config, null, 2))
  }
}

export default Config
