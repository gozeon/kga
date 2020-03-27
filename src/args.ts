import commandLineArgs from 'command-line-args'

import { Debug } from './debug'

/**
 * 解析命令行参数
 * @link: https://stackoverflow.com/questions/9725675/is-there-a-standard-format-for-command-line-shell-help-text
 * @TODO: 使用 https://github.com/substack/minimist or 使用commandLineArgs转换一下
 */

export class Arg {
  options: commandLineArgs.OptionDefinition[] = [{ name: 'help', alias: 'h' }]
  private _log = new Debug('arg')

  constructor() {}

  /**
   * 追加一个命令行解析
   * @param option commandLineArgs.OptionDefinition
   */
  addOption(option: commandLineArgs.OptionDefinition) {
    this.options.push(option)
    this._log.debug('add one option', option)
  }

  /**
   * 追加一组命令行解析
   * @param options commandLineArgs.OptionDefinition[]
   */
  appendOptions(options: commandLineArgs.OptionDefinition[]) {
    this.options.concat(options)
    this._log.debug('add multiple option', options)
  }

  /**
   * 获取命令行参数结果
   */
  getArgvs(): any {
    return commandLineArgs(this.options, { partial: true })
  }

  /**
   * 转换 process.argv
   * @param options commandLineArgs.OptionDefinition[]
   * @param argv string[]
   */
  formatOptions(
    options: commandLineArgs.OptionDefinition[],
    argv: string[]
  ): any {
    return commandLineArgs(options, { argv: argv, partial: true })
  }
}
