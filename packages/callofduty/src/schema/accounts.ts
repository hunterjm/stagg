export type ProfileLookup = Partial<Record<Platform, Username>>
export type Username = string
export type Platform = 'uno' | 'battle' | 'psn' | 'xbl' | 'steam'
export type ProfileId = ProfileId.UnoId | ProfileId.PlatformId
export namespace ProfileId {
    export interface UnoId { unoId: string }
    export interface PlatformId { username: string, platform: Platform }
}
