export const logColor = (color:'blue'|'green'|'yellow'|'red', message:string) => {
    let colorCode = ''
    switch(color) {
        case 'red':
            colorCode = '\x1b[31m'
            break
        case 'green':
            colorCode = '\x1b[32m'
            break
        case 'yellow':
            colorCode = '\x1b[33m'
            break
        case 'blue':
        default:
            colorCode = '\x1b[34m'
    }
    return console.log(`${colorCode}${message}${'\x1b[0m' /* reset */}`)
}
