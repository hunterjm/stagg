#! /usr/bin/env node
import * as cli from 'command-line-args'
import { hydrateGCP } from './cloudbuild'
import { devSetup } from './modules/dev'
import { dbMigration } from './modules/migration'

const options = cli([
    { name: 'verbose', alias: 'v', type: Boolean },
    { name: 'src', type: String, multiple: true, defaultOption: true },
    { name: 'timeout', alias: 't', type: Number }
])

if (options?.src?.length) {
    const [cmd, ...args] = options.src
    switch(cmd) {
        case 'migrate':
            dbMigration()
            break
        case 'dev':
            devSetup()
            break
        case 'hydrate':
            const [identifier] = args
            hydrateGCP(identifier)
            break
        default: console.error('Unrecognized command received by Stagg CLI')
    }
}
