import axios, { AxiosRequestConfig } from 'axios'
import { getEnvSecret } from '@stagg/gcp'
export * as Model from './models'
export * as Route from './routes'

export class FaaS {
    
}

export class API {
    private static network_key:string
    private static async request(options:AxiosRequestConfig) {
        if (!this.network_key) this.network_key = await getEnvSecret('NETWORK_KEY')
        console.log(`[>] Stagg.GoogleCloud.HTTP.${options?.method?.toUpperCase()}: ${options?.url}`)
        return axios({
            ...options,
            headers: { 'x-network-key': '' }
        })
    }
    public static async get(url:string) {
        return this.request({
            url,
            method: 'GET',
        })
    }
    public static async put(url:string, data?:any) {
        return this.request({
            url,
            data,
            method: 'PUT',
        })
    }
    public static async post(url:string, data?:any) {
        return this.request({
            url,
            data,
            method: 'POST',
        })
    }
}
