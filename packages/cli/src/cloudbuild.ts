
import * as fs from 'fs'
import * as yaml from 'js-yaml'
import * as shell from 'shelljs'
import { SecretManagerServiceClient } from '@google-cloud/secret-manager'
import { logColor } from './util'


type EnvVar = 'PORT' | 'SAMPLE_SECRET'
type DeploymentService = 'web-ui' | 'api'
type AppYaml = {
    env_variables: Record<EnvVar, string>
}


type ProjectId = 'staggco'
type SecretVersion = 'latest' | number
type SecretId = 'SAMPLE_SECRET' | 'EMPTY_SECRET'
type AppEngineService = 'api' | 'web-ui'
type CloudFunction = 'etl-callofduty'
type InstanceClass = 'F1'
type InstanceRuntime = 'nodejs12'
type InstanceMemory = '128MB' | '256MB' | '512MB'

const client = new SecretManagerServiceClient()


export async function getSecretGCP(secretId:SecretId, projectId:ProjectId='staggco', version:SecretVersion='latest') {
    const [secret] = await client.accessSecretVersion({ name: `projects/${projectId}/secrets/${secretId}/versions/${version}` })
    const secretPayload = secret.payload.data.toString()
    return secretPayload
}

const readFile = (filePath:string):string => {
    try {
        return fs.readFileSync(filePath, 'utf8')
    } catch(e) {
        logColor('red', `[!] ${e.message}`)
        process.exit(1)
    }
}

const writeFile = (filePath:string, fileContents:string):void => {
    try {
        fs.writeFileSync(filePath, fileContents, 'utf8')
    } catch(e) {
        logColor('red', `[!] ${e.message}`)
        process.exit(1)
    }
}

export const hydrateGCP = async (appYamlPath:string) => {
    logColor('yellow', '[>] Beginning secret hydration...')
    const rawAppYaml = readFile(appYamlPath)
    const rawAppYamlObj = yaml.safeLoad(rawAppYaml) as AppYaml
    for(const varName in rawAppYamlObj.env_variables) {
        const varValue = rawAppYamlObj.env_variables[varName]
        if (typeof varValue !== typeof 'str') { // cannot match regex pattern
            continue
        }
        const regex = new RegExp(/^\$\{([^\}]+)\}$/i)
        if (!varValue.match(regex)) { // did not match ${SECRET_NAME} pattern
            continue
        }
        const secretName = varValue.replace(regex, '$1')
        const secretValue = await getSecretGCP(secretName)
        rawAppYamlObj.env_variables[varName] = secretValue
    }
    const hydratedAppYaml = yaml.safeDump(rawAppYamlObj)
    writeFile(appYamlPath, hydratedAppYaml)
    const dotEnvPath = appYamlPath.replace('app.yaml', '.env')
    const hydratedDotEnvLines:string[] = Object.keys(rawAppYamlObj.env_variables).map(k => `${k}=${rawAppYamlObj.env_variables[k]}`)
    writeFile(dotEnvPath, hydratedDotEnvLines.join('\n'))
    readFile(dotEnvPath)
    process.exit(1)
}
