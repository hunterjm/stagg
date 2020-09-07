import * as deprecatedRequest from 'request'
export default async (req,res) => {
    const [,passableUrl] = req.url.split('?')
    const url = `https://quickchart.io/chart?${passableUrl}`
    req.pipe(deprecatedRequest(url)).pipe(res)
}