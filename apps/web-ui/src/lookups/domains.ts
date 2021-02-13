export interface DomainLookup {
    domainId: string
    name: string
}
export interface DomainLookupMap {
    [key:string]: DomainLookup
}
export const domainLookup:DomainLookupMap = {
    discord: {
        domainId: 'discord',
        name: 'Discord'
    },
    callofduty: {
        domainId: 'callofduty',
        name: 'Call of Duty'
    }
}

