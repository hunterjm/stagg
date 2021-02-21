import { terminal } from 'terminal-kit'

// https://console.cloud.google.com/apis/credentials
// https://console.cloud.google.com/apis/credentials/serviceaccountkey?project=staggco&authuser=1
// Secret Manager Secret Accessor - name for local computer/dev (dev-secrets-mdl)

export enum DeveloperRole {
    FED = 0,
    BED = 1,
    FSE = 2,
}
export const devSetup = async () => {
    terminal.clear()
    terminal.wrap.blue.bold(
        `-------------------------------------------------\n`,
        `|     Welcome to your onboarding companion!     |\n`,
        `-------------------------------------------------\n`,
    )

    terminal.on('key', (key:string) => key === 'CTRL_C' && process.exit())

    terminal.bold.yellow('[?] How will you be contributing?')
    const opts:string[] = []
    opts[DeveloperRole.FED] = 'Front-End'
    opts[DeveloperRole.BED] = 'Back-End'
    opts[DeveloperRole.FSE] = 'Full-Stack'
    terminal.singleColumnMenu(opts.map((opt,i) => `(${i+1}) ${opt}`), (err,res) => {
        switch(res.selectedIndex) {
            case DeveloperRole.FED:
                setupFED()
                setupComplete()
                break
            case DeveloperRole.BED:
                setupBED()
                setupComplete()
                break
            case DeveloperRole.FSE:
            default:
                terminal.dim(' Performing setup for both FED & BED...\n')
                setupFED()
                setupBED()
                setupComplete()
        }
    })


    // terminal.yesOrNo({ yes: ['y', 'ENTER'], no: ['n'] }, (err,res) => res ? true : false)

    // console.log('[1] Make sure you have permission to access the GCP project')
    // console.log('[2] Make sure you have downloaded and installed the following:')
    // console.log('    Berglas: https://github.com/GoogleCloudPlatform/berglas')
    // console.log('Enter Google Cloud Project ID below...')
    // prompt.start()
    // prompt.get(['projectId'], (err,res) => {
    //     if (err) {
    //         throw err
    //     }
    //     console.log('gcloud config set project', res?.projectId)
    // })
}

export const setupComplete = async () => {
    terminal.processExit(0)
}

export const setupFED = async () => {
    terminal.wrap.blue.bold(
        `-------------------------------------------------\n`,
        `| 🖥                 FED SETUP                🖥  |\n`,
        `-------------------------------------------------\n`,
    )
    terminal.bold.yellow('[?] Will you be contributing to the published npm modules?').dim(' (located in packages/**)')
    terminal.yesOrNo({ yes: ['y', 'ENTER'], no: ['n'] }, (err,res) => res ? true : setupComplete())
}

export const setupBED = async () => {
    terminal.wrap.blue.bold(
        `-------------------------------------------------\n`,
        `| 💾                BED SETUP                💾 |\n`,
        `-------------------------------------------------\n`,
    )
    
}

const setup = {
    npm: {
        init() {
            terminal.bold.cyan('https://www.npmjs.com/signup')
        }
    }
}
