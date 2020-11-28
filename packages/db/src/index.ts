import 'reflect-metadata'
export * as Stagg from './stagg'
export * as Discord from './discord'
export * as CallOfDuty from './callofduty'
// import { createConnection } from 'typeorm'

// TODO: Everthing down here is for some manual testing 
//       and should be deleted before PR is merged

// createConnection(
//    {
//       "name": "callofduty",
//       "type": "postgres",
//       "host": "127.0.0.1",
//       "port": 5432,
//       "username": "",
//       "password": "",
//       "database": "callofduty",
//       "synchronize": false,
//       "logging": false,
//       "entities": [
//          "src/callofduty/**/*{.ts,.js}"
//       ],
//       "migrations": [
//          "migration/callofduty/**/*{.ts,.js}"
//       ],
//       "cli": {
//          "migrationsDir": "migration/callofduty"
//       }
//    }
// ).then(async connection => {

//    console.log('Inserting a new account guy let\'s see if this works')
//    let account = new CallOfDuty.Account.Base.Entity()
//    account.userId = '14a5350f-ce2f-42db-b952-abf539bc5384'
//    account.unoId = 'exampleUnoId'

//    const accountRepo = connection.getCustomRepository(CallOfDuty.Account.Base.Repository)
//    account = await accountRepo.insertAccount(account)
//    console.log(account)
//    console.log('\n')
//    const eh = await accountRepo.findAllByUserId('14a5350f-ce2f-42db-b952-abf539bc5384')
//    console.log(eh)
//    console.log(eh.length)
//    console.log('\n')

//    console.log('ok time for auth')

//    const auth = new CallOfDuty.Account.Auth.Entity()
//    auth.account = account
//    auth.ip = 'example_ip123'
//    auth.email = 'example@example.com'
//    auth.games = ['mw', 'wwii']
//    auth.profiles = [
//       { username: 'Parkile', platform: 'psn' },
//       { username: 'DaLindsey', platform: 'uno' }
//    ]
//    auth.tokens = {
//       sso: 'example_sso_Or_Something',
//       atkn: 'example_ATKN_1234',
//       xsrf: 'example_xsrf_#%@#@'
//    }

//    const authRepo = connection.getCustomRepository(CallOfDuty.Account.Auth.Repository)
//    const authResult = await authRepo.insertAuth(auth)
//    console.log(authResult)
// })

// const eh = (): CallOfDuty.Account.Base.Entity => {
//    return new CallOfDuty.Account.Base.Entity();
// }
