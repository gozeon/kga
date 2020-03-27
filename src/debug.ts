import DebugLib from 'debug'
import log from 'fancy-log'

/**
 * debug
 * @example DEBUG='*'
 * @todo 可集成一个log引入，或者选择loglevel
 */
export class Debug {
  private _appName = require('../package.json').appName
  // mainDebug = DebugLib(this._appName)
  debug: DebugLib.Debugger
  dir: any = log.dir
  error: any = log.error
  info: any = log.info
  warn: any = log.warn
  constructor(scope: string) {
    this.debug = DebugLib(`${this._appName}:${scope}`)
  }
}
