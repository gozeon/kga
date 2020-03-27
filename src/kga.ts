import { extname, join } from 'path'
import * as _ from 'lodash'
import { CosmiconfigResult } from 'cosmiconfig/dist/types'

import { Arg } from './args'
import { Config } from './config'
import { Debug } from './debug'

/**
 * KGA 命令行数据
 */
export interface KgaData {
  argvs: {
    [key: string]: string | boolean | any[]
  }
  config: CosmiconfigResult
  env: {
    cwd: string
    argv: string[]
    pluginFile?: string
  }
}

/**
 * 主类
 * @description 其实可以像 yo [generoator]:doSomething , 但是这样就必须要发包了，不如找到配置然后引入，可以放到本地
 */
export class Kga {
  arg: Arg
  config: Config
  private _log = new Debug('main')

  constructor(name: string) {
    this.arg = new Arg()
    this.arg.addOption({
      name: 'plugin',
      alias: 'p',
    })
    this.config = new Config(name)
  }

  /**
   * 启动
   */
  async run() {
    this._log.debug('starting...')

    const argvs = this.arg.getArgvs()
    const config = this.config.getConfig()
    let data: KgaData = _.assign(
      {},
      { argvs },
      { config },
      {
        env: {
          cwd: process.cwd(),
          argv: process.argv,
        },
      }
    )

    // TODO: 自定义的命令行参数可以在这里先获取配置，再parse传回data，同时也要支持再plugin的hook模式
    data = this._parseUnknownArgv(data)

    this._log.debug(data)

    try {
      const pluginPath =
        _.get(data, 'argvs.plugin') || _.get(data, 'config.config.plugin')
      const currentPluginPath = this._formatPluginPath(pluginPath, data.env.cwd)
      data.env.pluginFile = require.resolve(currentPluginPath)
      const Plugin = require(currentPluginPath)
      const pluginInstance = new Plugin(data)

      // TODO: 下面可以使用范型进行简化
      // 检查实例 writing 方法
      if (Reflect.has(pluginInstance, 'writing')) {
        await pluginInstance.writing()
      } else {
        // exit
        throw new Error('no found method: wirting')
      }

      // 写入磁盘
      await pluginInstance.doWriting()

      // 检查实例 end 方法
      if (!Reflect.has(pluginInstance, 'end')) {
        Reflect.defineProperty(pluginInstance, 'end', {
          value: function () {
            ;(this as any).log.debug('enjoy it.')
          },
        })
      }

      await pluginInstance.end()
    } catch (e) {
      this._log.error(e.message)
      this._log.info(`doc: ${require('../package.json').homepage}`)
      process.exit(2)
    }
  }

  /**
   * 或者真正的plugin 目录
   * @param targetPath 目标path
   * @param cwd 命令行所在目录
   */
  private _formatPluginPath(targetPath: string = '', cwd: string): string {
    this._log.debug(`format plugin path: cwd: ${cwd}`)
    if (_.isEmpty(targetPath)) {
      this._log.debug(`plugin is empty`)
      throw new Error('please set one plugin')
    }

    // 相对路径的
    if (extname(targetPath) === '.js') {
      this._log.debug(`format plugin path: plugin is local.`)
      return join(cwd, targetPath)
    }

    this._log.debug(`format plugin path: plugin is dependencies.`)

    // dependencies
    // 追加一个 node_modules path，优先级第一
    module.paths.unshift(join(cwd, 'node_modules'))
    return targetPath
  }

  /**
   * 转化配置里的 argvOptions
   * @param data KgaData
   */
  private _parseUnknownArgv(data: KgaData): KgaData {
    const { config, env } = data
    this._log.debug(`start parse unknown argvOptions...`)
    this._log.debug(config?.config.argvOptions)
    this._log.debug(env.argv)

    if (_.isArray(config?.config.argvOptions)) {
      const argvs = this.arg.formatOptions(config?.config.argvOptions, env.argv)
      data = _.merge(data, { argvs })
    }
    this._log.debug(`end parse unknown argvOptions...`)
    return data
  }
}
