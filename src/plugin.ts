import { join } from 'path'

import * as memFs from 'mem-fs'
import * as editor from 'mem-fs-editor'
import * as through from 'through2'
import commandLineArgs from 'command-line-args'
import * as _ from 'lodash'

import { Debug } from './debug'
import { KgaData } from './kga'

/**
 * 插件
 * @description 插件主类，每个插件继承该类
 */
export class Plugin {
  log = new Debug('plugin')
  kgaData: KgaData
  store = memFs.create()
  fs = editor.create(this.store)
  newFiles: string[] = []
  argOptions: commandLineArgs.OptionDefinition[] = []

  constructor(data: KgaData) {
    this.kgaData = data
  }

  /**
   * 模版获得模版目录
   */
  templatePath(template: string = 'templates'): string {
    return join(this.kgaData.env?.pluginFile || '', '..', template)
  }

  /**
   * 输出目录
   */
  destinationPath(dest: string = ''): string {
    return join(this.kgaData.env.cwd, dest)
  }

  /**
   * 写出磁盘
   */
  doWriting(): Promise<void> {
    this.log.debug('writing file to disk')
    return new Promise((resolve, reject) => {
      const newFiles = this.newFiles
      // Doc: https://github.com/SBoudrias/mem-fs-editor#commitfilters-callback
      const filter = through.obj(function (file, enc, cb) {
        this.push(file)
        newFiles.push(file.path)
        cb()
      })
      this.fs.commit([filter], () => {
        // log change file
        _.forEach(this.newFiles, (item) => {
          this.log.info('\x1b[36m%s\x1b[0m %s', 'done', item)
        })
        resolve()
      })
    })
  }
}
