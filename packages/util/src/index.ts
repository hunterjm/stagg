export const commaNum = (num:Number) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
export const percentage = (divisor:number, dividend:number, decimals:number=2) => ((divisor / dividend) * 100).toFixed(decimals)
export const delay = (ms:number) => new Promise(resolve => setTimeout(() => resolve(), ms))
export const pluralizeStr = (str:string, count:number) => count === 1 ? str : `${str}s`
export const spaces = (num:number) => {
    let spaces = ''
    for(let i = 0; i < num; i++) {
        spaces += ' '
    }
    return spaces
}
export const snakeToPascal = (input:string) => 
    (input + '').split('_').map(s => s.slice(0,1).toUpperCase() + s.slice(1, s.length)).join('')


export namespace Postgres {
    export namespace Normalize {
        export const Element = (elem:any) => {
            if (typeof elem !== typeof {}) {
                return elem
            }
            return `${JSON.stringify(elem)}`
        }
        export const Model = <T>(model:any):T => {
            for(const key in model) {
                const val = model[key]
                if (Array.isArray(val)) {
                    model[key] = `array[${val.map(v => `'${Normalize.Element(v)}'`).join(',')}]`
                } else {
                    // Asume it is JSON
                    model[key] = Normalize.Element(val)
                }
            }
            return model
        }
    }
    export namespace Denormalize {
        export const Model = <T>(model:any):T => {
            for(const key in model) {
                if (!model[key].match) {
                    console.log(`[?] Postgres.Denormalize.Model cannot match on ${key}, skipping...`)
                    console.log(typeof model[key], model[key])
                    continue
                }
                if (model[key].match(/^"{.*}"$/)) { // JSON
                    model[key] = JSON.parse(model[key])
                } else if (model[key].match(/^{.*}$/)) { // array
                    model[key] = Denormalize.Array(model[key])
                }
            }
            return model
        }
        export const Array = <T>(pgArr:string):T[] => {
            const stripped = pgArr.replace(/^{(.*)}$/, '$1').replace(/"}"/g, '"}').replace(/"{"/g, '{"')
            if (stripped.match(/^{/)) {
                return JSON.parse(`[${stripped}]`)
            }
            const arr = []
            for(const elem of stripped.split(',')) {
                arr.push(isNaN(Number(elem)) ? elem : Number(elem))
            }
            return arr
        }
    }
}
