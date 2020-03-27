#!/usr/bin/env node

import { Kga } from './kga'

const app = new Kga(require('../package.json').appName)
app
  .run()
  .then(() => {
    // TODO: check cli version for update
    // console.log('end')
  })
  .catch((err) => {
    console.log(err)
    process.exit(1)
  })
