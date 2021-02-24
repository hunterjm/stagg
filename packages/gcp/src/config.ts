import * as merge from 'deepmerge'
import { readFileSync } from 'fs'
import {
    Env,
    env,
    getEnvSecret,
    getFileContents,
} from '.'

export interface Config {
    membership: {
        price: {
            year: number
            month: number
        }
    }
    jwt: { secret: string }
    postgres: {
        db: string
        user: string
        pass: string
        host: string
        socketpath: string
    }
    discord: {
        client: {
            id: string
            scope: string
            token: string
            secret: string
        }
        roles: {
            ranking: {
                skip: string
                limit: string
                colors: string[]
            }
        }
        channels: {
            public: { reporting: string }
            private: { reporting: string }
        }
        messages: {
            help: string[]
            loading: string[]
            invalid: string[]
            account: {
                ready: string[]
                welcome: string[]
                unregistered: string[]
            }
        }
    }
    callofduty: {
        bot: {
            auth: { sso: string, xsrf: string, atkn: string }
        }
        wz: {
            sus: {
                kills: number
                damageTaken: number
                ratios: { top: string, bottom: string, limit: number, threshold?: { top?: number, bottom?: number } }[]
            }
            ranking: {
                tiers: string[]
                weights: {
                    scorePerGame: number
                    killsPerGame: number
                    killsPerDeath: number
                }
                thresholds: {
                    scorePerGame: number[]
                    killsPerGame: number[]
                    killsPerDeath: number[]
                }
            }
        }
    }
    network: {
        key: string
        host: {
            web: string
            api: string
            faas: {
                bot: { message: string }
                etl: {
                    account: string
                    cheaters: string
                    orchestrator: string
                    discord: { role: string }
                }
                event: { handler: string }
                render: { html: string, chart: string }
            }
            discord: {
                oauth: {
                    redirect: string
                    identify: string
                    exchange: string
                }
                invite: {
                    help: string
                    welcome: string
                }
            }
        }
        port: {
            web: number
            api: number
            faas: {
                bot: { message: number }
                etl: {
                    account: number
                    cheaters: number
                    orchestrator: number
                    discord: { role: number }
                }
                event: { handler: number }
                render: { html: number, chart: number }
            }
        }
        timing: {
            faas: {
                etl: {
                    account: {
                        timeout: number
                        respawn: number
                        interval: {
                            premium: number
                            standard: number
                        }
                    }
                }
            }
        }
    }
}

export const useConfig = async (objRef:{}):Promise<void> => {
    const parentDir = env === Env.Local ? 'local' : 'production'
    const prioritizedFiles = ['common.json', `${parentDir}/common.json`]
    // Check if it's a package we can extend with localized config if applicable...
    try {
        const packageJson = JSON.parse(readFileSync(`${process.cwd()}/package.json`).toString())
        prioritizedFiles.push(`${parentDir}/${packageJson.name}.json`)
    } catch(e) {}
    // Compile config output
    let config = <Config>{}
    for(const file of prioritizedFiles) {
        try {
            const fileContents = await getConfigFile(file)
            config = merge(config, JSON.parse(fileContents))
        } catch(e) { console.log(`[?] Config file "${file}" not found...`) }
    }
    await recursiveRefHydration(config)
    config.network.port = recursivePortDiscovery(config.network.host)
    for(const key in config) {
        objRef[key] = config[key]
    }
}

const recursivePortDiscovery = (hostObj:object, productionPort:number=8080):any => {
    const clone = { ...hostObj }
    for(const key in clone) {
        if (typeof clone[key] === typeof 'str') {
            if (env === Env.Production) {
                clone[key] = productionPort
            } else {
                const port = clone[key].replace(/^.*:([0-9]+)$/, '$1')
                clone[key] = !port || port === clone[key] ? productionPort : Number(port)
            }
        } else if (typeof clone[key] === typeof {} && !Array.isArray(clone[key])) {
            clone[key] = recursivePortDiscovery(clone[key])
            continue
        } else {
            delete clone[key]
        }
    }
    return clone
}

const recursiveRefHydration = async (obj:object) => {
    for(const key in obj) {
        if (typeof obj[key] === typeof {} || Array.isArray(obj[key])) {
            await recursiveRefHydration(obj[key])
        }
        if (typeof obj[key] === typeof 'str' && obj[key].match(/\$\{[^\}]+\}/)) {
            const varKey = obj[key].replace(/\$\{([^\}]+)\}/, '$1')
            const varVal = await getEnvSecret(varKey)
            obj[key] = obj[key].replace('${'+varKey+'}', varVal)
        }
    }
}


export const getConfigFile = async (filepath:string, useEnv:Env=env) => {
    if (useEnv === Env.Local) {
        const rootDir = findRepoRoot()
        const fullPath = `${rootDir}/runtime-config/${filepath}`
        console.log('[$] Using local runtime configuration', fullPath)
        return readFileSync(fullPath).toString()
    }
    return getFileContents(filepath, 'stagg-runtime-config')
}
export const getConfigJson = async <T={[key:string]:any}>(filename:string, useEnv?:Env) => {
    const fileContents = await getConfigFile(`${env === Env.Local ? 'dev' : 'production'}/${filename}`, useEnv)
    return <T>JSON.parse(fileContents)
}
const findRepoRoot = (dirLimit:number=32):string => {
    let activeDir:string = __dirname.split('\\').join('/')
    for(let i = 0; i < dirLimit; i++) {
        try {
            const packageJson = readFileSync(`${activeDir}/package.json`).toString()
            const parsedPackage = JSON.parse(packageJson)
            if (parsedPackage.name === 'stagg') {
                return activeDir
            }
        } catch(e) {}
        const split = activeDir.split('/')
        activeDir = split.slice(0, split.length-1).join('/')
    }
    throw new Error('Unable to find monorepo root directory')
}
