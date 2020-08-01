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
    { dir: 'discord',   service: 'discord' },
    { dir: 'scrape',    service: 'scrape' },
    { dir: 'img.chart', service: 'render-chart' },
    { dir: 'img.view',  service: 'render-view' },
    { dir: 'web-ui',    service: 'default' },
]
console.log('[+] Secret app.yaml generated')
for(const { dir, service } of serviceMaps) {
    const serviceYaml = genericYaml.split('<% SERVICE %>').join(service)
    fs.writeFileSync(`${__dirname}/../services/${dir}/app.yaml`, serviceYaml, 'utf8')
    console.log(`    Service "${service}" complete; ${dir}/app.yaml ready`)
}
