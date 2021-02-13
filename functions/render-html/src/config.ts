import { getConfigJson } from '@stagg/gcp'
export const IS_DEV = process.env.NODE_ENV === 'development'
export const WEB_UI_URL = IS_DEV ? 'http://localhost:8080' : 'https://stagg.co'

export const CONFIG = {
    HOST_WEB_UI: ''
}
export const initializeConfig = async () => {
    const { HOST_WEB_UI } = await getConfigJson('functions-render-html.json')
    CONFIG.HOST_WEB_UI = HOST_WEB_UI
}
