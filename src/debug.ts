import DebugLib from 'debug'

/**
 * debug
 * @example DEBUG='*'
 */
export class Debug {
  private _appName = require('../package.json').appName
  mainDebug = DebugLib(this._appName)
  debug: DebugLib.Debugger
  constructor(scope: string) {
    this.debug = DebugLib(`${this._appName}:${scope}`)
    this.mainDebug(`初始化 debug: ${scope}`)
  }
}
