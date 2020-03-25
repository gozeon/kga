import * as _ from 'lodash'

import { Arg } from './args'
import { Config } from './config'
import { Debug } from './debug'

/**
 * 主类
 */
class Kga {
  arg: Arg
  config: Config
  private _log = new Debug('main')

  constructor(name: string) {
    this.arg = new Arg()
    this.arg.addOption({
      name: 'plugins',
      alias: 'p',
    })
    this.config = new Config(name)
  }

  /**
   * 启动
   */
  run() {
    this._log.debug('启动')
    const argvs = this.arg.getArgvs()
    const config = this.config.getConfig()
    const data = _.assign(
      {},
      { argvs },
      { config },
      { env: { cwd: process.cwd() } },
      {
        _data: _.assign(
          config?.config,
          {
            filepath: config?.filepath,
            isEmpty: config?.isEmpty,
          },
          argvs
        ),
      }
    )
    this._log.debug(data)
    if (_.isEmpty(data.argvs.plugins)) {
      console.log(1)
    }
    console.log(_.isEmpty(null))
  }
}

const app = new Kga(require('../package.json').appName)
app.run()
