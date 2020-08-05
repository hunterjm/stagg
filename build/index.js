const fs = require('fs')
const yaml = require('js-yaml')
// Translate GCP Secrets into ENV Vars
const envVars = ['JWT_SECRET', 'GMAIL_ADDRESS', 'GMAIL_PASSWORD', 'DISCORD_TOKEN', 'MONGO_DB', 'MONGO_HOST', 'MONGO_USER', 'MONGO_PASS']
const templateYaml = fs.readFileSync(`${__dirname}/app.yaml`, 'utf8')
const [objYaml] = yaml.safeLoadAll(templateYaml)
for(const v of envVars) {
    objYaml.env_variables[v] = fs.readFileSync(`${__dirname}/.env.${v}`, 'utf8').trim()
    fs.unlinkSync(`${__dirname}/.env.${v}`)
}
const genericYaml = yaml.safeDump(objYaml)
const serviceMaps = [
    { dir: 'web-ui',    service: 'default',      instance: 'B1' },
    { dir: 'scrape',    service: 'scrape',       instance: 'B1' },
    { dir: 'discord',   service: 'discord',      instance: 'B1' },
    { dir: 'img.view',  service: 'render-view',  instance: 'B1' },
    { dir: 'img.chart', service: 'render-chart', instance: 'B1' },
] // Pricing: F1=$0.05/hr, F2=$0.10/hr, F4=$0.20/hr, F4_1G=$0.30/hr
console.log('[+] Secret app.yaml generated')
for(const { dir, service, instance } of serviceMaps) {
    const serviceYaml = genericYaml.split('<% SERVICE %>').join(service).split('<% INSTANCE %>').join(instance)
    fs.writeFileSync(`${__dirname}/../services/${dir}/app.yaml`, serviceYaml, 'utf8')
    console.log(`    Service "${service}" complete; ${dir}/app.yaml ready`)
}
