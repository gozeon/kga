const { Plugin } = require('../build/plugin')

module.exports = class extends Plugin {
  writing() {
    // this.log.debug('ad')
    // this.log.info(this.kgaData)
    // this.log.info(this.fs)
    this.log.info(this.templatePath())
    this.log.info(this.destinationPath('./dest'))
    this.fs.copyTpl(
      `${this.templatePath()}/**/?(.)!(_)*`,
      this.destinationPath('./dest'),
      {
        name: 'kga',
      }
    )
  }
  end() {
    console.log(this.kgaData.argvs.foo)
    console.log('\ndone.\n')
  }
}
