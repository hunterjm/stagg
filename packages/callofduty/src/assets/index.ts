import { Schema } from '..'
export * as MW from './mw'
// export * as BO4 from './bo4'

export interface PlatformDetails {
    id: Schema.Platform // API recognized name
    name: string // full name
    label: string // 3 letter abbr
}
export const Platform = (id:Schema.Platform):PlatformDetails => Platforms[id]
export const Platforms:Record<Schema.Platform, PlatformDetails> = {
    uno:    { id: 'uno',    label: 'ATV', name: 'Activision'          },
    xbl:    { id: 'xbl',    label: 'XBL', name: 'Xbox Live'           },
    psn:    { id: 'psn',    label: 'PSN', name: 'PlayStation Network' },
    steam:  { id: 'steam',  label: 'STM', name: 'Steam'               },
    battle: { id: 'battle', label: 'BTL', name: 'Battle.net'          },
}
