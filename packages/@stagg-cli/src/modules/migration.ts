import { writeFileSync } from 'fs'
import { terminal } from 'terminal-kit'
import { getEnvSecret } from '@stagg/gcp'
import * as shell from 'shelljs'

const cleanPath = (path:string):string => path.split('\\').join('/')

const dbModulePath = cleanPath(require.resolve('@stagg/db')).replace(/\/index.js/i, '')
async function generateMigrationFile(env:'development'|'staging'|''):Promise<string> {
    const username = await getEnvSecret('PGSQL_USER', <any>env)
    const password = await getEnvSecret('PGSQL_PASS', <any>env)
    const config = [{
        name: 'stagg',
        type: 'postgres',
        host: '127.0.0.1',
        port: 5432,
        username,
        password,
        database: 'stagg',
        synchronize: false,
        logging: false,
        entities: [
            `${dbModulePath}/entities/**/*{.ts,.js}`
        ],
        migrations: [
            `${process.cwd()}/migrations/**/*{.ts,.js}`
        ],
        cli: {
            migrationsDir: `migrations`
        }
    }]
    const configJson = JSON.stringify(config)
    return configJson
}

const typeormPath = cleanPath(require.resolve('typeorm')).replace(/\/index.js/i, '')
async function generateMigration(env:'staging'|'production') {
    const config = await generateMigrationFile(env === 'production' ? '' : 'staging')
    writeFileSync(process.cwd() + '/ormconfig.json', config)
    shell.exec(`cd ${dbModulePath}/.. && yarn tsc`)
    shell.exec(`yarn ts-node ${typeormPath}/cli.js migration:generate -c stagg -n stagg-${env}`)
    shell.exec(`yarn ts-node ${typeormPath}/cli.js migration:run -c stagg`)
    shell.exec(`yarn rimraf migrations`)
    shell.exec(`yarn rimraf ormconfig.json`)
    process.exit(0)
}

export const dbMigration = async () => {
    terminal.clear()
    terminal.wrap.blue.bold(
        `-------------------------------------------------\n`,
        `| Welcome to the awesomest migration tool ever! |\n`,
        `-------------------------------------------------\n`,
    )
    terminal.wrap.gray(
        `Found your @stagg/db path at\n${dbModulePath}`
    )

    terminal.on('key', (key:string) => key === 'CTRL_C' && process.exit())
    terminal.singleColumnMenu(['staging', 'production'], (err,res) => {
        switch(res.selectedIndex) {
            case 1: // production
                terminal.dim('Using production db...\n')
                generateMigration('production')
                break
            case 0: // staging
            default:
                terminal.dim('Using staging db...\n')
                generateMigration('staging')
        }
    })
}
