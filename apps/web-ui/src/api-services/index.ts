import cfg from 'config/ui'
import Cookies from 'js-cookie'
import * as Discord from './discord'
import * as CallOfDuty from './callofduty'
import { cookies } from 'src/store'

export interface NestError {
    statusCode: number
    error: string // eg: "Unauthorized"
    message: string | string[] // eg: "invalid credentials"
}
export interface Response<T> {
    status: number
    response?: T
    error?: string // eg: "Unauthorized"
    message?: string | string[] // only present with error, eg: "invalid credentials"
}
export const API = {
    Discord,
    CallOfDuty,
    url(url:string):string {
        return url.replace(/\/+/g, '/').replace(/http(s?):\/*/, 'http$1://')
    },
    async login(domainId:string) {
        return API.Post<{ jwt:string }>('/user/login', { jwt: Cookies.get(`jwt.${domainId}`) })
    },
    async signup(domainIds:string[]) {
        const domains = {}
        for(const domain of domainIds) {
            domains[domain] = { domainId: domain, jwt: Cookies.get(`jwt.${domain}`) }
        }
        return API.Post<{ jwt:string }>('/user/create', { domains })
    },
    async Fetch<T>(url:string, method:'GET'|'PUT'|'POST', payload?:{[key:string]:any}):Promise<Response<T>> {
        const requestUrl = this.url(`${cfg.api.host}/${url}`)
        const headers:any = {
            'content-type': 'application/json',
        }
        if (cookies.jwtUser) {
            headers.authorization = `Bearer ${cookies.jwtUser}`
        }
        const requestOptions:any = {
            method,
            headers,
        }
        if (payload) {
            requestOptions.body = JSON.stringify(payload)
        }
        const res = await fetch(requestUrl, requestOptions)
        const resJson = await res.json()
        if (resJson?.error) {
            return {
                status: resJson.statusCode,
                error: resJson.error,
                message: resJson.message,
            }
        }
        return { status: res.status, response: resJson }
    },
    async Get<T>(url:string):Promise<Response<T>> {
        return this.Fetch(url, 'GET')
    },
    async Put<T>(url:string, payload?:{[key:string]:any}):Promise<Response<T>> {
        return this.Fetch(url, 'PUT', payload)
    },
    async Post<T>(url:string, payload?:{[key:string]:any}):Promise<Response<T>> {
        return this.Fetch(url, 'POST', payload)
    },
}
