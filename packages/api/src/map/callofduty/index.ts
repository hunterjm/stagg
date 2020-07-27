import * as MW from './mw'
// https://my.callofduty.com/content/atvi/callofduty/mycod/web/en/data/json/iq-content-xweb.js // map, mode, weapon names
// https://my.callofduty.com/api/papi-client/ce/v1/title/mw/platform/battle/match/8944019869464002060/matchMapEvents // heatmap

export { MW }
export const Platforms = {
    uno:    { label: 'ATV', name: 'Activision'          },
    xbl:    { label: 'XBL', name: 'Xbox Live'           },
    psn:    { label: 'PSN', name: 'PlayStation Network' },
    steam:  { label: 'STM', name: 'Steam'               },
    battle: { label: 'BTL', name: 'Battle.net'          },
}
