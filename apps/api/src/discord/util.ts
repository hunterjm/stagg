export const commaNum = (num:Number) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
export function truncateOutput(output:string):string {
    let truncatedResponse = output
    if (truncatedResponse.length > 2000) {
        const closingCodeTag = '...```'
        const truncatedDisclaimer = `\n> _Message truncated; original message ${commaNum(output.length)} chars long_`
        const baseIndex = 2000 - truncatedDisclaimer.length
        truncatedResponse = truncatedResponse.slice(0, baseIndex)
        const hasUnclosedCodeTag = !(truncatedResponse.split('```').length % 2)
        if (hasUnclosedCodeTag) truncatedResponse = truncatedResponse.slice(0, baseIndex - closingCodeTag.length) + closingCodeTag
        truncatedResponse += truncatedDisclaimer
    }
    return truncatedResponse
}
export type Output = string | string[]
export function formatOutput(lines:Output):string {
  if (!Array.isArray(lines)) {
    lines = lines.split('\n')
  }
  return this.truncateOutput(lines.reduce((prev, curr) => prev + `> ${curr}\n`, ''))
}
