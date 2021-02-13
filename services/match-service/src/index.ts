import { Request, Response } from 'express'
import { buildParameters, MatchHistoryService } from './match-history'

// export default async (req:Request, res:Response) => {
//     console.log('[+] Match History Request')
    
//     // add required fields logic and shit like that

//     const service = new MatchHistoryService()
//     try {
//         const params = buildParameters(req.query)
//         const result = await service.getHistoryByAccountId(params)
//         res.status(200).send(result)
//     } catch (error) {
//         res.status(500).send({ error })
//     }
// }