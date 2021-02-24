
export const normalizeModel = <T>(model:any):T => {
    for(const key in model) {
        const val = model[key]
        if (Array.isArray(val)) {
            model[key] = normalizeArray(val)
        } else {
            // Asume it is JSON
            model[key] = normalizeElement(val)
        }
    }
    return model
}
export const normalizeArray = (arr:any[]):string => !Array.isArray(arr) ? arr : `{${arr.map((e:any) => normalizeElement(e)).join(',')}}`
export const normalizeElement = (elem:any) => {
    if (typeof elem !== typeof {}) {
        return elem
        // if (typeof elem === typeof 89) {
        //     return elem
        // }
        // return `'${elem}'`
    }
    return `'${JSON.stringify(elem)}'`
}

export const denormalizeModel = <T>(model:any):T => {
    for(const key in model) {
        if (!model[key]?.match) {
            continue
        }
        if (model[key].match(/^"{.*}"$/)) { // JSON
            model[key] = JSON.parse(model[key])
        } else if (model[key].match(/^{.*}$/)) { // array
            model[key] = denormalizeArray(model[key])
        }
    }
    return model
}
export const denormalizeArray = <T>(pgArr:string):T[] => {
    if (Array.isArray(pgArr)) {
        return pgArr
    }
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

export const arrayTransformer = { to: normalizeArray, from: denormalizeArray }

