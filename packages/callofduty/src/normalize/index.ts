import { Schema } from '..'
import * as MW from './mw'

export { MW }
export const Platform = (id:Schema.API.Platform):Schema.Platform => Platforms[id]
export const Platforms:{[key:string]:Schema.Platform} = {
    uno:    { id: 'uno',    label: 'ATV', name: 'Activision'          },
    xbl:    { id: 'xbl',    label: 'XBL', name: 'Xbox Live'           },
    psn:    { id: 'psn',    label: 'PSN', name: 'PlayStation Network' },
    steam:  { id: 'steam',  label: 'STM', name: 'Steam'               },
    battle: { id: 'battle', label: 'BTL', name: 'Battle.net'          },
}
