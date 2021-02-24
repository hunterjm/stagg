import {
    getFileContents,
} from './storage'

import {
    getSecret,
    getEnvSecret,
    SecretVersion,
} from './secrets'

import {
    Config,
    useConfig,
    getConfigFile,
    getConfigJson,
} from './config'

const { NODE_ENV:env } = <{NODE_ENV:Env}>process.env
enum Env {
    Local='development',
    Staging='staging',
    Production=''
}

const validateNetworkAuth = async (req:any,res:any):Promise<void> => {
    if (!req?.headers || !req.headers['x-network-key']) {
        res.status(400).send({ error: 'missing network key' })
        throw 'missing network key'
    }
    const networkKey = await getEnvSecret('NETWORK_KEY')
    if (req.headers['x-network-key'] !== networkKey) {
        res.status(401).send({ error: 'invalid network key' })
        throw 'missing network key'
    }
}

export {
    env,
    Env,
    Config,
    SecretVersion,
    useConfig,
    getSecret,
    getEnvSecret,
    getConfigFile,
    getConfigJson,
    getFileContents,
    validateNetworkAuth,
}
