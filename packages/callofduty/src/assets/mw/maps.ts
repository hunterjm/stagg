import { Schema } from '../..'

const minimap = (mapId:Schema.API.MW.Map) => `https://www.callofduty.com/cdn/app/maps/mw/compass_map_${mapId}.jpg`
const thumbnail = (mapId:Schema.API.MW.Map) => `https://www.callofduty.com/cdn/app/base-maps/mw/${mapId}.jpg`

const Map = (id:Schema.API.MW.Map):Schema.Map => Maps[id]
const Maps:{[key:string]:Schema.Map} = {}
Maps.mp_hackney_am = {
    id: 'mp_hackney_am',
    games: ['mw'],
    name: 'Hackney Yard',
    type: 'mp',
    images: {
        minimap: minimap('mp_hackney_am'),
        thumbnail: thumbnail('mp_hackney_am'),
    }
}
Maps.mp_hackney_yard = {
    id: 'mp_hackney_yard',
    games: ['mw'],
    name: 'Hackney Yard (Night)',
    type: 'mp',
    images: {
        minimap: minimap('mp_hackney_yard'),
        thumbnail: thumbnail('mp_hackney_yard'),
    }
}
Maps.mp_aniyah = {
    id: 'mp_aniyah',
    games: ['mw'],
    name: 'Aniyah Palace',
    type: 'mp',
    images: {
        minimap: minimap('mp_aniyah'),
        thumbnail: thumbnail('mp_aniyah'),
    }
}
Maps.mp_euphrates = {
    id: 'mp_euphrates',
    games: ['mw'],
    name: 'Euphrates Bridge',
    type: 'mp',
    images: {
        minimap: minimap('mp_euphrates'),
        thumbnail: thumbnail('mp_euphrates'),
    }
}
Maps.mp_raid = {
    id: 'mp_raid',
    games: ['mw'],
    name: 'Grazna Raid',
    type: 'mp',
    images: {
        minimap: minimap('mp_raid'),
        thumbnail: thumbnail('mp_raid'),
    }
}
Maps.mp_m_pine = {
    id: 'mp_m_pine',
    games: ['mw'],
    name: 'Pine',
    type: 'mp',
    images: {
        minimap: minimap('mp_m_pine'),
        thumbnail: thumbnail('mp_m_pine'),
    }
}
Maps.mp_m_stack = {
    id: 'mp_m_stack',
    games: ['mw'],
    name: 'Stack',
    type: 'mp',
    images: {
        minimap: minimap('mp_m_stack'),
        thumbnail: thumbnail('mp_m_stack'),
    }
}
Maps.mp_deadzone = {
    id: 'mp_deadzone',
    games: ['mw'],
    name: 'Arklov Peak',
    type: 'mp',
    images: {
        minimap: minimap('mp_deadzone'),
        thumbnail: thumbnail('mp_deadzone'),
    }
}
Maps.mp_quarry2 = {
    id: 'mp_quarry2',
    games: ['mw'],
    name: 'Karst River Quarry',
    type: 'mp',
    images: {
        minimap: minimap('mp_quarry2'),
        thumbnail: thumbnail('mp_quarry2'),
    }
}
Maps.mp_m_overunder = {
    id: 'mp_m_overunder',
    games: ['mw'],
    name: 'Docks',
    type: 'mp',
    images: {
        minimap: minimap('mp_m_overunder'),
        thumbnail: thumbnail('mp_m_overunder'),
    }
}
Maps.mp_cave_am = {
    id: 'mp_cave_am',
    games: ['mw'],
    name: 'Azhir Cave',
    type: 'mp',
    images: {
        minimap: minimap('mp_cave_am'),
        thumbnail: thumbnail('mp_cave_am'),
    }
}
Maps.mp_cave = {
    id: 'mp_cave',
    games: ['mw'],
    name: 'Azhir Cave (Night)',
    type: 'mp',
    images: {
        minimap: minimap('mp_cave'),
        thumbnail: thumbnail('mp_cave'),
    }
}
Maps.mp_runner = {
    id: 'mp_runner',
    games: ['mw'],
    name: 'Gun Runner',
    type: 'mp',
    images: {
        minimap: minimap('mp_runner'),
        thumbnail: thumbnail('mp_runner'),
    }
}
Maps.mp_runner_pm = {
    id: 'mp_runner_pm',
    games: ['mw'],
    name: 'Gun Runner (Night)',
    type: 'mp',
    images: {
        minimap: minimap('mp_runner_pm'),
        thumbnail: thumbnail('mp_runner_pm'),
    }
}
Maps.mp_piccadilly = {
    id: 'mp_piccadilly',
    games: ['mw'],
    name: 'Piccadilly',
    type: 'mp',
    images: {
        minimap: minimap('mp_piccadilly'),
        thumbnail: thumbnail('mp_piccadilly'),
    }
}
Maps.mp_spear = {
    id: 'mp_spear',
    games: ['mw'],
    name: 'Rammaza',
    type: 'mp',
    images: {
        minimap: minimap('mp_spear'),
        thumbnail: thumbnail('mp_spear'),
    }
}
Maps.mp_spear_pm = {
    id: 'mp_spear_pm',
    games: ['mw'],
    name: 'Rammaza (Night)',
    type: 'mp',
    images: {
        minimap: minimap('mp_spear_pm'),
        thumbnail: thumbnail('mp_spear_pm'),
    }
}
Maps.mp_petrograd = {
    id: 'mp_petrograd',
    games: ['mw'],
    name: 'St. Petrograd',
    type: 'mp',
    images: {
        minimap: minimap('mp_petrograd'),
        thumbnail: thumbnail('mp_petrograd'),
    }
}
Maps.mp_m_hill = {
    id: 'mp_m_hill',
    games: ['mw'],
    name: 'Hill',
    type: 'mp',
    images: {
        minimap: minimap('mp_m_hill'),
        thumbnail: thumbnail('mp_m_hill'),
    }
}
Maps.mp_m_king = {
    id: 'mp_m_king',
    games: ['mw'],
    name: 'King',
    type: 'mp',
    images: {
        minimap: minimap('mp_m_king'),
        thumbnail: thumbnail('mp_m_king'),
    }
}
Maps.mp_m_speedball = {
    id: 'mp_m_speedball',
    games: ['mw'],
    name: 'Speedball',
    type: 'mp',
    images: {
        minimap: minimap('mp_m_speedball'),
        thumbnail: thumbnail('mp_m_speedball'),
    }
}
Maps.mp_m_showers = {
    id: 'mp_m_showers',
    games: ['mw'],
    name: 'Gulag Showers',
    type: 'mp',
    category: 'cage',
    images: {
        minimap: minimap('mp_m_showers'),
        thumbnail: thumbnail('mp_m_showers'),
    }
}
Maps.mp_downtown_gw = {
    id: 'mp_downtown_gw',
    games: ['mw'],
    name: 'Tarvosk District',
    type: 'mp',
    category: 'groundwar',
    images: {
        minimap: minimap('mp_downtown_gw'),
        thumbnail: thumbnail('mp_downtown_gw'),
    }
}
Maps.mp_m_speed = {
    id: 'mp_m_speed',
    games: ['mw'],
    name: 'Shoot House',
    type: 'mp',
    images: {
        minimap: minimap('mp_m_speed'),
        thumbnail: thumbnail('mp_m_speed'),
    }
}
Maps.mp_farms2_gw = {
    id: 'mp_farms2_gw',
    games: ['mw'],
    name: 'Krovnik Farmland',
    type: 'mp',
    category: 'groundwar',
    images: {
        minimap: minimap('mp_farms2_gw'),
        thumbnail: thumbnail('mp_farms2_gw'),
    }
}
Maps.mp_port2_gw = {
    id: 'mp_port2_gw',
    games: ['mw'],
    name: 'Port',
    type: 'mp',
    category: 'groundwar',
    images: {
        minimap: minimap('mp_port2_gw'),
        thumbnail: thumbnail('mp_port2_gw'),
    }
}
Maps.mp_crash2 = {
    id: 'mp_crash2',
    games: ['mw'],
    name: 'Crash',
    type: 'mp',
    images: {
        minimap: minimap('mp_crash2'),
        thumbnail: thumbnail('mp_crash2'),
    }
}
Maps.mp_vacant = {
    id: 'mp_vacant',
    games: ['mw'],
    name: 'Vacant',
    type: 'mp',
    images: {
        minimap: minimap('mp_vacant'),
        thumbnail: thumbnail('mp_vacant'),
    }
}
Maps.mp_shipment = {
    id: 'mp_shipment',
    games: ['mw'],
    name: 'Shipment',
    type: 'mp',
    images: {
        minimap: minimap('mp_shipment'),
        thumbnail: thumbnail('mp_shipment'),
    }
}
Maps.mp_m_cargo = {
    id: 'mp_m_cargo',
    games: ['mw'],
    name: 'Cargo',
    type: 'mp',
    images: {
        minimap: minimap('mp_m_cargo'),
        thumbnail: thumbnail('mp_m_cargo'),
    }
}
Maps.mp_m_cage = {
    id: 'mp_m_cage',
    games: ['mw'],
    name: 'Atrium',
    type: 'mp',
    images: {
        minimap: minimap('mp_m_cage'),
        thumbnail: thumbnail('mp_m_cage'),
    }
}
Maps.mp_m_overwinter = {
    id: 'mp_m_overwinter',
    games: ['mw'],
    name: 'Docks', // two docks? + overunder
    type: 'mp',
    images: {
        minimap: minimap('mp_m_overwinter'),
        thumbnail: thumbnail('mp_m_overwinter'),
    }
}
Maps.mp_m_stadium = {
    id: 'mp_m_stadium',
    games: ['mw'],
    name: 'Verdansk Stadium',
    type: 'mp',
    images: {
        minimap: minimap('mp_m_stadium'),
        thumbnail: thumbnail('mp_m_stadium'),
    }
}
Maps.mp_emporium = {
    id: 'mp_emporium',
    games: ['mw'],
    name: 'Atlas Superstore',
    type: 'mp',
    images: {
        minimap: minimap('mp_emporium'),
        thumbnail: thumbnail('mp_emporium'),
    }
}
Maps.mp_rust = {
    id: 'mp_rust',
    games: ['mw'],
    name: 'Rust',
    type: 'mp',
    images: {
        minimap: minimap('mp_rust'),
        thumbnail: thumbnail('mp_rust'),
    }
}
Maps.mp_boneyard_gw = {
    id: 'mp_boneyard_gw',
    games: ['mw'],
    name: 'Zhokov Boneyard',
    type: 'mp',
    images: {
        minimap: minimap('mp_boneyard_gw'),
        thumbnail: thumbnail('mp_boneyard_gw'),
    }
}
Maps.mp_m_fork = {
    id: 'mp_m_fork',
    games: ['mw'],
    name: 'Bazaar',
    type: 'mp',
    images: {
        minimap: minimap('mp_m_fork'),
        thumbnail: thumbnail('mp_m_fork'),
    }
}
Maps.mp_donetsk = {
    id: 'mp_donetsk',
    games: ['mw'],
    name: 'Verdansk',
    type: 'wz',
    images: {
        // minimap: minimap('mp_donetsk'),
        thumbnail: thumbnail('mp_donetsk'),
    }
}
Maps.mp_donetsk2 = {
    ...Maps.mp_donetsk,
    id: 'mp_donetsk2',
    images: {
        // minimap: minimap('mp_donetsk2'),
        thumbnail: thumbnail('mp_donetsk2'),
    }
}
Maps.mp_don3 = {
    ...Maps.mp_donetsk,
    id: 'mp_don3',
    images: {
        // minimap: minimap('mp_don3'),
        thumbnail: thumbnail('mp_don3'),
    }
}
Maps.mp_hideout = {
    id: 'mp_hideout',
    games: ['mw'],
    name: 'Khandor Hideout',
    type: 'mp',
    images: {
        minimap: minimap('mp_hideout'),
        thumbnail: thumbnail('mp_hideout'),
    }
}
Maps.mp_aniyah_tac = {
    id: 'mp_aniyah_tac',
    games: ['mw'],
    name: 'Aniyah Incursion',
    type: 'mp',
    images: {
        minimap: minimap('mp_aniyah_tac'),
        thumbnail: thumbnail('mp_aniyah_tac'),
    }
}
Maps.mp_backlot2 = {
    id: 'mp_backlot2',
    games: ['mw'],
    name: 'Talsik Backlot',
    type: 'mp',
    images: {
        minimap: minimap('mp_backlot2'),
        thumbnail: thumbnail('mp_backlot2'),
    }
}
Maps.mp_village2 = {
    id: 'mp_village2',
    games: ['mw'],
    name: 'Hovec Sawmill',
    type: 'mp',
    images: {
        minimap: minimap('mp_village2'),
        thumbnail: thumbnail('mp_village2'),
    }
}
Maps.mp_hardhat = {
    id: 'mp_hardhat',
    games: ['mw'],
    name: 'Hardhat',
    type: 'mp',
    images: {
        minimap: minimap('mp_hardhat'),
        thumbnail: thumbnail('mp_hardhat'),
    }
}
Maps.mp_m_wallco2 = {
    id: 'mp_m_wallco2',
    games: ['mw'],
    name: 'Aisle 9',
    type: 'mp',
    images: {
        minimap: minimap('mp_m_wallco2'),
        thumbnail: thumbnail('mp_m_wallco2'),
    }
}
Maps.mp_scrapyard = {
    id: 'mp_scrapyard',
    games: ['mw'],
    name: 'Zhokov Scrapyard',
    type: 'mp',
    images: {
        minimap: minimap('mp_scrapyard'),
        thumbnail: thumbnail('mp_scrapyard'),
    }
}
Maps.mp_m_trench = {
    id: 'mp_m_trench',
    games: ['mw'],
    name: 'Trench',
    type: 'mp',
    category: 'cage',
    images: {
        minimap: minimap('mp_m_trench'),
        thumbnail: thumbnail('mp_m_trench'),
    }
}
Maps.mp_promenade_gw = {
    id: 'mp_promenade_gw',
    games: ['mw'],
    name: 'Barakett Promenade',
    type: 'mp',
    category: 'groundwar',
    images: {
        minimap: minimap('mp_promenade_gw'),
        thumbnail: thumbnail('mp_promenade_gw'),
    }
}
Maps.mp_garden = {
    id: 'mp_garden',
    games: ['mw'],
    name: 'Cheshire Park',
    type: 'mp',
    images: {
        minimap: minimap('mp_garden'),
        thumbnail: thumbnail('mp_garden'),
    }
}
Maps.mp_oilrig = {
    id: 'mp_oilrig',
    games: ['mw'],
    name: 'Petrov Oil Rig',
    type: 'mp',
    images: {
        minimap: minimap('mp_oilrig'),
        thumbnail: thumbnail('mp_oilrig'),
    }
}
Maps.mp_harbor = {
    id: 'mp_harbor',
    games: ['mw'],
    name: 'Suldal Harbor',
    type: 'mp',
    images: {
        minimap: minimap('mp_harbor'),
        thumbnail: thumbnail('mp_harbor'),
    }
}
Maps.mp_layover_gw = {
    id: 'mp_layover_gw',
    games: ['mw'],
    name: 'Verdansk International Airport',
    type: 'mp',
    category: 'groundwar',
    images: {
        minimap: minimap('mp_layover_gw'),
        thumbnail: thumbnail('mp_layover_gw'),
    }
}
Maps.mp_m_cornfield = {
    id: 'mp_m_cornfield',
    games: ['mw'],
    name: 'Livestock',
    type: 'mp',
    category: 'cage',
    images: {
        minimap: minimap('mp_m_cornfield'),
        thumbnail: thumbnail('mp_m_cornfield'),
    }
}

export { Map, Maps }
