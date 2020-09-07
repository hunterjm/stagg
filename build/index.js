const fs = require('fs')
const yaml = require('js-yaml')
const { exec } = require('child_process')
const { hydration } = require('./package.json')

// Should reflect project structure
const APPS_DIR = 'apps'
const SERVICES_DIR = 'services'

// Prerequisite information
const { apps, services } = hydration
const delay = (ms) => new Promise(resolve => setTimeout(() => resolve(), ms))
const requiredSecrets = [...new Set([].concat.apply([], 
    [].concat.apply([], 
        Object.values(hydration).map(obj => Object.values(obj).map(({secrets}) => secrets))
    )
))]

// Apps = GCP App Engine Services
function hydrateApp(dir, hydratedSecrets) {
    const appYaml = {}
    const { port, service, runtime, instance, secrets } = apps[dir]
    appYaml.service = service
    appYaml.runtime = runtime
    appYaml.instance_class = instance
    appYaml.env_variables = { PORT: port }
    for(const secret of secrets) {
        if (!hydratedSecrets[secret]) {
            throw `${APPS_DIR}/${dir} missing secret ${secret}`
        }
        appYaml.env_variables[secret] = hydratedSecrets[secret]
    }
    const appYamlStr = yaml.safeDump(appYaml)
    fs.writeFileSync(`${__dirname}/../${APPS_DIR}/${dir}/app.yaml`, appYamlStr, 'utf8')
    console.log(`[+] App "${dir}" complete; ${APPS_DIR}/${dir}/app.yaml ready`)
}

// Services = GCP Cloud Functions
function hydrateService(dir, hydratedSecrets) {
    const secretsYaml = {}
    const { secrets } = services[dir]
    for(const secret of secrets) {
        if (!hydratedSecrets[secret]) {
            throw `${SERVICES_DIR}/${dir} missing secret ${secret}`
        }
        secretsYaml[secret] = hydratedSecrets[secret]
    }
    const secretsYamlStr = yaml.safeDump(secretsYaml)
    fs.writeFileSync(`${__dirname}/../${SERVICES_DIR}/${dir}/.env.yaml`, secretsYamlStr, 'utf8')
    console.log(`[+] Service "${dir}" complete; ${SERVICES_DIR}/${dir}/.env.yaml ready`)
}

// Download individual secret from GCP
async function downloadSecretFromGCP(secret, destroyDownloadedSecret=true) {
    let secretValue
    const child = exec(`gcloud secrets versions access latest --secret=${secret} > .env.${secret}`, (error, stdout, stderr) => {
        if (error || stderr) throw error || stderr
        secretValue = fs.readFileSync(`${__dirname}/.env.${secret}`, 'utf8').trim()
        if (destroyDownloadedSecret) {
            fs.unlinkSync(`${__dirname}/.env.${secret}`)
        }
        console.log(`[>] Hydrated secret "${secret}" with "${secretValue}"`)
    })
    await new Promise((resolve,reject) => {
        child.addListener("exit", resolve)
        child.addListener("error", reject)
    })
    return secretValue
}

// Read local .env.* files, return their value as a mapped object, and delete the source file if applicable
function fetchDownloadedSecrets(destroyDownloadedSecrets=true) {
    const hydratedSecrets = {}
    for(const secret of requiredSecrets) {
        try {
            hydratedSecrets[secret] = fs.readFileSync(`${__dirname}/.env.${secret}`, 'utf8').trim()
            if (destroyDownloadedSecrets) {
                fs.unlinkSync(`${__dirname}/.env.${secret}`)
            }
            console.log(`[>] Found secret "${secret}" containing "${hydratedSecrets[secret]}"`)
        } catch(e) {
            console.log(`[!] No secret file for "${secret}" supplied...`)
        }
    }
    return hydratedSecrets
}

// Main function to call to hydrate secrets for all apps and services
async function hydrate() {
    const hydratedSecrets = fetchDownloadedSecrets()
    console.log('[#] Presupplied secrets:', hydratedSecrets)
    const missingSecretKeys = requiredSecrets.filter(key => !Object.keys(hydratedSecrets).includes(key))
    if (missingSecretKeys.length) {
        console.log('[?] Downloading:', missingSecretKeys.join(', '))
        for(const secret of missingSecretKeys) {
            hydratedSecrets[secret] = await downloadSecretFromGCP(secret)
        }
    }
    await delay(requiredSecrets.length * 100)
    for(const appKey in apps) {
        hydrateApp(appKey, hydratedSecrets)        
    }
    for(const serviceKey in services) {
        hydrateService(serviceKey, hydratedSecrets)        
    }
}

hydrate()
