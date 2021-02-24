import { SecretManagerServiceClient } from '@google-cloud/secret-manager'
import { Env, env } from '.'


const client = new SecretManagerServiceClient()
const parserMap = {
    BOT_COD_AUTH_TOKENS_JSON: (s:string) => <{ atkn:string, xsrf:string, sso:string }>JSON.parse(s)
}
export type SecretVersion = 'latest' | number
export const getSecret = async (secretId:string, projectId:string='staggco', version:SecretVersion='latest') => {
    const [secret] = await client.accessSecretVersion({ name: `projects/${projectId}/secrets/${secretId}/versions/${version}` })
    const secretPayload = secret.payload.data.toString()
    return secretPayload
}
export async function getEnvSecret(secretId:string, useEnv:Env=env):Promise<string> {
    const parser = parserMap[secretId] ? parserMap[secretId] : (v:string) => v
    if (useEnv === Env.Local || useEnv === Env.Staging) {
        try {
            const newSecretId = `STAGING__${secretId}`
            const secretPayload = await getSecret(newSecretId, 'staggco', 'latest')
            if (secretPayload) {
                console.log('[$] Using staging secret', newSecretId)
                return parser(secretPayload)
            }
        } catch(e) {}
    }
    const secretPayload = await getSecret(secretId, 'staggco', 'latest')
    return parser(secretPayload)
}