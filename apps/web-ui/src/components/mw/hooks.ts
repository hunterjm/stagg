import { Schema, Assets } from 'callofduty'
import { UserStateModel } from 'src/hooks/getUser'
// Get the preferred profile/url to use and translate maybe?
export const getUnoUsernameFromUserModel = (userState:UserStateModel) => {
    for(const {domainId, model} of userState?.accounts) {
        if (domainId === 'callofduty') {
            return model.profiles.find(p => p.platform === 'uno')?.username
        }
    }
    return ''
}
export const profileUrlFromUserStateModel = (userModel:UserStateModel) => {
  let profileUrl = `/mw/$${userModel.user.userId}`
  try {
    const unoUsername = getUnoUsernameFromUserModel(userModel)
    profileUrl = `/mw/${unoUsername.replace('#', '@')}`
  } catch(e) { console.log(e) }
  return profileUrl
}

/*
const urlPlatformUno = '/mw/uno/MellowD@7998347'
const urlPlatformPsn = '/mw/psn/MellowD'
const urlDiscrimSlug = '/mw/69943859/MellowD'
const urlDiscrimSuffix = '/mw/MellowD@7998347'
const urlCodAcctId = '/mw/@9b9e2798-7239-46f8-a284-a860bc4a7f3f'
const urlStaggUserId = '/mw/$9b9e2798-7239-46f8-a284-a860bc4a7f3f'
*/
const sanitizeUrl = (url:string) => url.replace(/^\//, '').replace(/\/$/, '').split('/')
export const translateProfileUrlToGameId = (url:string):Schema.Game => {
    const dirPaths = sanitizeUrl(url)
    const [game] = <[Schema.Game]>dirPaths
    if (!Assets.Game(game)) {
        throw `invalid game ${game}`
    }
    return game
}
export const translateProfileUrlToAPI = (url:string) => {
    const dirPaths = sanitizeUrl(url)
    if (dirPaths.length === 2) { // using a single identifier
        const [, id] = dirPaths
        if (id.match(/^\$/)) { // using Stagg userId
            const withoutPrefix = id.replace(/^\$/, '')
            return translateProfileUrlFromStaggUserId(withoutPrefix)
        }
        if (id.match(/^@/)) { // using CallOfDuty accountId
            const withoutPrefix = id.replace(/^@/, '')
            return translateProfileUrlFromAccountId(withoutPrefix)
        }
        // assume it is an uno platform identifier if it lacks prefixes above
        return translateProfileUrlFromPlatformId('uno', id)
    }
    // using a dual identifier...
    const [, slug, id] = dirPaths
    const slugAsPlatform = <Schema.Platform>slug
    if (Assets.Platform(slugAsPlatform)) {
        return translateProfileUrlFromPlatformId(slugAsPlatform, id)
    }
    // assume the slug is an uno profile discriminator...
    return translateProfileUrlFromPlatformId('uno', `${id}#${slug}`)
}
const translateProfileUrlFromStaggUserId = (userId:string) => `user/${userId}`
const translateProfileUrlFromAccountId = (accountId:string) => `account/${accountId}`
const translateProfileUrlFromPlatformId = (platform:Schema.Platform, username:string) => `${platform}/${encodeURIComponent(username.replace('@', '#'))}`
