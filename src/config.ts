import { cosmiconfigSync } from 'cosmiconfig'
import { CosmiconfigResult } from 'cosmiconfig/dist/types'
import { Debug } from './debug'

/**
 * 读取配置
 */
export class Config {
  moduelName: string
  config: CosmiconfigResult = null
  private _log = new Debug('config')

  /**
   * app名字
   * @param moduleName string
   */
  constructor(moduleName: string) {
    this.moduelName = moduleName
    this._log.debug(`moduleName: ${moduleName}`)
  }

  /**
   * 获取配置
   */
  getConfig(): CosmiconfigResult {
    const explorerSync = cosmiconfigSync(this.moduelName)
    return explorerSync.search()
  }
}
