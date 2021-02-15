import * as DB from '@stagg/db'
import { MW } from '@callofduty/assets'
import { Mode } from '@callofduty/types'
import { isArray } from 'class-validator'

export type FilterUrlQuery = Record<keyof typeof Filters, string>

enum UOM { Days = 'd', Matches = 'm' }
type Measurement = { uom: UOM, count: number }
type FilterMap = Record<keyof typeof Filters, number | Mode[] | Measurement>

type MeasurementClause = 'skip' | 'limit'
type Clause = 'where' | MeasurementClause
type Query = { clause: Clause, condition: string }
type QueryOperator = '<' | '>' | '<=' | '>=' | '='
type QueryColumn = keyof DB.CallOfDuty.MW.Match.Entity

const d2s = (d:number):number => d * 24 * 60 * 60
const sec = ():number => Math.round(new Date().getTime() / 1000)
const utc = (s:number):number => s + (new Date().getTimezoneOffset() * 60)
const num = (n:string):number => (n=n.replace(/[^0-9]/g, '')) && isNaN(Number(n)) ? 0 : Number(n)
const uom = (n:string):UOM => (n=n.replace(/[0-9]/g, '')) && <UOM>(Object.values(UOM).includes(<UOM>n) ? n : 'd')
const validMode = (m:string):Boolean => {
    if (Object.keys(MW.Modes).includes(m)) {
        return true
    }
    for(const mode of Object.keys(MW.Modes)) {
        if (mode.includes(m)) {
            return true
        }
    }
    return false
}
const modes = (p:string):Mode[] => p?.split(',').map(m => m.trim()).filter(m => validMode(m)) as Mode[]

class Filters {
    public static limit?            (p:string):Measurement { return { uom: uom(p), count: num(p) } }
    public static skip?             (p:string):Measurement { return { uom: uom(p), count: num(p) } }
    public static xpMin?            (p:string):number      { return num(p) }
    public static xpMax?            (p:string):number      { return num(p) }
    public static scoreMin?         (p:string):number      { return num(p) }
    public static scoreMax?         (p:string):number      { return num(p) }
    public static killsMin?         (p:string):number      { return num(p) }
    public static killsMax?         (p:string):number      { return num(p) }
    public static deathsMin?        (p:string):number      { return num(p) }
    public static deathsMax?        (p:string):number      { return num(p) }
    public static timePlayedMin?    (p:string):number      { return num(p) }
    public static timePlayedMax?    (p:string):number      { return num(p) }
    public static teamPlacementMin? (p:string):number      { return num(p) }
    public static teamPlacementMax? (p:string):number      { return num(p) }
    public static modesIncluded?    (p:string):Mode[]      { return modes(p) }
    public static modesExcluded?    (p:string):Mode[]      { return modes(p) }
}
class FilterQuery {
    public static limit?            (m:Measurement):Query  { return measurementQuery(m, 'limit') }
    public static skip?             (m:Measurement):Query  { return measurementQuery(m, 'skip') }
    public static xpMin?            (n:number):Query       { return statQuery(n, '>=', 'stat_xp_total') }
    public static xpMax?            (n:number):Query       { return statQuery(n, '<=', 'stat_xp_total') }
    public static scoreMin?         (n:number):Query       { return statQuery(n, '>=', 'stat_score') }
    public static scoreMax?         (n:number):Query       { return statQuery(n, '<=', 'stat_score') }
    public static killsMin?         (n:number):Query       { return statQuery(n, '>=', 'stat_kills') }
    public static killsMax?         (n:number):Query       { return statQuery(n, '<=', 'stat_kills') }
    public static deathsMin?        (n:number):Query       { return statQuery(n, '>=', 'stat_deaths') }
    public static deathsMax?        (n:number):Query       { return statQuery(n, '<=', 'stat_deaths') }
    public static timePlayedMin?    (n:number):Query       { return statQuery(n, '>=', 'stat_time_played') }
    public static timePlayedMax?    (n:number):Query       { return statQuery(n, '<=', 'stat_time_played') }
    public static teamPlacementMin? (n:number):Query       { return statQuery(n, '>=', 'stat_team_placement') }
    public static teamPlacementMax? (n:number):Query       { return statQuery(n, '<=', 'stat_team_placement') }
    public static modesIncluded?    (m:Mode[]):Query[]     { return m.map(m => ({ clause: 'where', condition: `mode_id ~ '${m}'` }))}
    public static modesExcluded?    (m:Mode[]):Query[]     { return m.map(m => ({ clause: 'where', condition: `mode_id !~ '${m}'` }))}
}

const statQuery = (n:number, op:QueryOperator, col:QueryColumn):Query => ({ clause: 'where', condition: `${col} ${op} ${n}` })
const measurementQuery = (m:Measurement, c:MeasurementClause):Query => {
    if (!m.count) {
        return null
    }
    if (m.uom === UOM.Days) {
        return {
            clause: 'where',
            condition: `end_time ${c === 'limit' ? '>' : '<'}= ${utc(sec() - d2s(m.count))}`,
        }
    }
    return {
        clause: c,
        condition: m.count.toString(),
    }
}

export const reduceFilters = (q:FilterUrlQuery):FilterMap => {
    const mappedFilters = <FilterMap>{}
    for(const paramName in q) {
        const paramParser = Filters[paramName]
        if (!paramParser) continue
        mappedFilters[paramName] = paramParser(q[paramName])
    }
    // if limit and skip in days, add skip to limit
    const skip = mappedFilters.skip as Measurement
    const limit = mappedFilters.limit as Measurement
    const skipDays = skip?.uom === UOM.Days
    const limitDays = limit?.uom === UOM.Days
    if (limitDays && skipDays) {
        limit.count += skip.count
        mappedFilters.limit = limit
    }
    return mappedFilters
}
export const reduceSqlSuffix = (filters:FilterMap):string => {
    const compiledQueries = <Query[]>[]
    for(const paramName in filters) {
        const queryParser = FilterQuery[paramName]
        if (!queryParser) continue
        const parsedQuery = queryParser(filters[paramName])
        if (!isArray(parsedQuery) && parsedQuery) {
            compiledQueries.push(parsedQuery)
        }
        if (isArray(parsedQuery) && parsedQuery.length) {
            compiledQueries.push(...parsedQuery)
        }
    }
    const wheres  = <string[]>[]
    const limits  = <string[]>[]
    const skips   = <string[]>[]
    for(const { clause, condition } of compiledQueries) {
        if (!condition?.trim()) continue
        switch(clause) {
            case 'limit': limits.push(condition)
                break
            case 'skip': skips.push(condition)
                break
            case 'where':
            default: wheres.push(condition)
        }
    }
    let query = wheres.join(' AND ')
    if (skips.length)  query += ` OFFSET ${skips.join(',')}`
    if (limits.length) query += ` LIMIT  ${limits.join(',')}`
    console.log(query)
    return query
}

export const urlQueryToSql = (q:FilterUrlQuery):string => reduceSqlSuffix(reduceFilters(q))
