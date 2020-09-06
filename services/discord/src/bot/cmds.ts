import * as Discord from 'discord.js'
import * as cod from './callofduty'
import * as sys from './system'
import lfg from './lfg'

type Dispatcher = (m:Discord.Message, ...args:string[]) => void
interface DispatcherMap {
    _default?: Dispatcher
    [key:string]: Dispatcher | DispatcherMap
}

const cmd:DispatcherMap = {
    lfg,
    help: sys.help,
    shortcut: sys.shortcut,
    search: cod.search,
    register: cod.register,
    cod: {
        mw: {}, // reflects mw below
        wz: {}, // reflects wz below
        search: cod.search,
        register: cod.register,
    },
    mp: {
        _default: cod.mp._default,
        stats: {
            _default: cod.mp.stats._default,
            all: cod.mp.stats.all
        }
    },
    wz: {
        _default: cod.wz._default,
        help: cod.wz.help,
        search: cod.search,
        register: cod.register,
        teams: cod.wz.teams,
        chart: cod.wz.charts,
        list: {
            _default: cod.wz.list.stats,
            stats: cod.wz.list.stats,
        },
        stats: {
            _default: cod.wz.stats._default,
            all: cod.wz.stats.all,
            solo: cod.wz.stats.solo,
            duo: cod.wz.stats.duo,
            trio: cod.wz.stats.trio,
            quad: cod.wz.stats.quad,
            combined: cod.wz.stats.combined,
        },
        all: cod.wz.stats.all,
        solo: cod.wz.stats.solo,
        duo: cod.wz.stats.duo,
        trio: cod.wz.stats.trio,
        quad: cod.wz.stats.quad,
        combined: cod.wz.stats.combined,
    }
}
cmd.cod['mw'] = cmd.mw
cmd.cod['wz'] = cmd.wz

export default cmd
