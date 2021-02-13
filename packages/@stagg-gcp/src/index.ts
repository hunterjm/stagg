import { readFileSync } from 'fs'
import { Storage } from '@google-cloud/storage'
import { SecretManagerServiceClient } from '@google-cloud/secret-manager'

const { NODE_ENV:env } = <{NODE_ENV:Env}>process.env
enum Env {
    Dev='development',
    Staging='staging',
    Production=''
}

const storage = new Storage()
const client = new SecretManagerServiceClient()

export type SecretVersion = 'latest' | number
export const getSecret = async (secretId:string, projectId:string='staggco', version:SecretVersion='latest') => {
    const [secret] = await client.accessSecretVersion({ name: `projects/${projectId}/secrets/${secretId}/versions/${version}` })
    const secretPayload = secret.payload.data.toString()
    return secretPayload
}
export async function getEnvSecret(secretId:string, useEnv:Env=env):Promise<string> {
    if (useEnv === Env.Dev || useEnv === Env.Staging) {
        try {
            const newSecretId = `STAGING__${secretId}`
            const secretPayload = await getSecret(newSecretId, 'staggco', 'latest')
            if (secretPayload) {
                console.log('[$] Using staging secret', newSecretId)
                return secretPayload
            }
        } catch(e) {}
    }
    return getSecret(secretId, 'staggco', 'latest')
}
export const getFileContents = (filepath:string, bucket:string):Promise<string> => new Promise(resolve => {
    const fileStream = storage.bucket(bucket).file(filepath).createReadStream()
    let fileStreamRes:string = ''
    fileStream.on('end', () => resolve(fileStreamRes))
    fileStream.on('data', (chunk:string) => fileStreamRes += chunk)
})
export const getConfigFile = async (filename:string, useEnv:Env=env) => {
    if (useEnv === Env.Dev) {
        const rootDir = findRepoRoot()
        const fullPath = `${rootDir}/runtime/dev/${filename}`
        console.log('[$] Using local runtime configuration', fullPath)
        return readFileSync(fullPath).toString()
    }
    return getFileContents(`production/${filename}`, 'stagg-runtime-config')
}
export const getConfigJson = async <T={[key:string]:any}>(filename:string, useEnv?:Env) => {
    const fileContents = await getConfigFile(filename, useEnv)
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
