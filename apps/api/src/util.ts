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
