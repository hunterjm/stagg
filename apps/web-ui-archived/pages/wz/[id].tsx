import Head from 'next/head'
import Cookies from 'js-cookie'
import { commaNum } from '@stagg/util'
import { useRouter } from 'next/router'
import { useState } from 'react'
import Card from '../../components/Card'
import Center from '../../components/Center'
import Template, { FixedOverlay } from '../../components/Template'
import GamesByMode from './[id]/charts/GamesByMode'
import DownsByCircle from './[id]/charts/DownsByCircle'
import TopFinishesByMode from './[id]/charts/TopFinishesByMode'
import StatByRank from './[id]/charts/StatByRank'
import StatOverTime from './[id]/charts/StatOverTime'
import WinsByMode from './[id]/charts/WinsByMode'
import Filters, { Filters as FiltersType } from './[id]/Filters'
import AnyStatByRank from './[id]/charts/AnyStatByRank'
import cfg from '../../config/ui'

const inferUsername = (id:string) => {
    const [name, slug] = id.split('@')
    return !slug ? name : `${name}#${slug}`
}

export const colors = [
    'rgba(0, 255, 0, 0.5)',
    'rgba(255, 255, 0, 0.5)',
    'rgba(255, 0, 0, 0.5)',
    'rgba(255, 0, 255, 0.5)',
    'rgba(0, 255, 255, 0.5)',
    'rgba(0, 0, 255, 0.5)',
]

const Page = ({ user, count, discord, filters }) => {
    const router = useRouter()
    const username = inferUsername(router.query.id as string)
    const isMe = user?.profiles?.uno === username
    const [performanceMap, setPerformanceMap] = useState({ [username]: [] })
    const [activeFilters, setActiveFilters] = useState(filters || cfg.filters.default as FiltersType)
    const setFilters = (filters?:FiltersType) => {
        const newFilters = filters ? filters : cfg.filters.default
        Cookies.set('filters', JSON.stringify(newFilters), { expires: 365 })
        setActiveFilters(newFilters)
    }

    // Move active user to top of performanceMap keys if necessary
    if (performanceMap[username] && Object.keys(performanceMap).indexOf(username) > 0) {
        const updatedPerformanceMap = {...performanceMap}
        delete updatedPerformanceMap[username]
        setPerformanceMap({
            [username]: performanceMap[username],
            ...updatedPerformanceMap
        })
    }
  
    const filteredPerformanceMap = { ...performanceMap }
    for(const username in filteredPerformanceMap) {
      const originalCount = filteredPerformanceMap[username].length
      filteredPerformanceMap[username] = filteredPerformanceMap[username]
        .sort((a,b) => {
            const { prop, stat, order } = activeFilters.sort
            if (prop) return order ? a[prop] - b[prop] : b[prop] - a[prop]
            if (stat) return order ? a.stats[stat] - b.stats[stat] : b.stats[stat] - a.stats[stat]
            return a.startTime - b.startTime
        }).filter((p) => {
          if (!p.stats.teamPlacement) return false
          for(const stat in p.stats) {
              if (activeFilters.stats[stat]) {
                  if (activeFilters.stats[stat].min && p.stats[stat] < activeFilters.stats[stat].min) return false
                  if (activeFilters.stats[stat].max && p.stats[stat] > activeFilters.stats[stat].max) return false
              }
          }
          return true
        })
      if (activeFilters.sort.limit) {
        filteredPerformanceMap[username] = filteredPerformanceMap[username].slice(0, activeFilters.sort.limit)
      }
      if (originalCount && !filteredPerformanceMap[username].length) setFilters()
    }


    return (
    <Template user={user}>
        {
            !filteredPerformanceMap[username].length ? <FixedOverlay><Center><h1>Loading { commaNum(count.performances) } matches...</h1></Center></FixedOverlay> : <></>
        }
        <Head>
            <title>{ isMe ? '(ME) ' : '' }{ username } : { commaNum(count.performances) } Matches | Call of Duty Warzone</title>
        </Head>
        <Center>
            <Filters
                username={username}
                filters={activeFilters}
                setFilters={setFilters}
                performanceMap={performanceMap}
                setPerformanceMap={setPerformanceMap} />
            <Card label="Games by Mode">
                <GamesByMode performances={filteredPerformanceMap[username]} />
            </Card>
            <Card label="Wins by Mode">
                <WinsByMode performances={filteredPerformanceMap[username]} />
            </Card>
            <Card label="Top 10 Finish % by Mode">
                <TopFinishesByMode performances={filteredPerformanceMap[username]} />
            </Card>
            <Card label="Downs by Circle">
                <DownsByCircle performances={filteredPerformanceMap[username]} />
            </Card>
            <AnyStatByRank colors={colors} username={username} performanceMap={filteredPerformanceMap} />
            <Card label="Damage by Finish" large expandable>
                <StatByRank
                    yStep={200}
                    colors={colors}
                    username={username}
                    performanceMap={filteredPerformanceMap}
                    stat="damageDone" />
            </Card>
            <Card label="Damage per Kill over time" large expanded>
                <StatOverTime
                    yStep={100}
                    colors={colors}
                    username={username}
                    performanceMap={filteredPerformanceMap}
                    stat={{ divisor: 'damageDone', dividend: 'kills' }} />
            </Card>
        </Center>
    </Template>
    )
}

Page.getInitialProps = async ({ query }) => {
    const username = inferUsername(query.id)
    const ping = await fetch(`${cfg.api.host}/ping`, {
        method: 'POST',
        body: JSON.stringify({ username, platform: 'uno' })
    })
    const { performances } = await ping.json()
    return { count: { performances } }
}

export default Page
