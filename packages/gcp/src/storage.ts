import { Storage } from '@google-cloud/storage'

const storage = new Storage()
export const getFileContents = (filepath:string, bucket:string):Promise<string> => new Promise((resolve,reject) => {
    const fileStream = storage.bucket(bucket).file(filepath).createReadStream()
    let fileStreamRes:string = ''
    fileStream.on('end', () => resolve(fileStreamRes))
    fileStream.on('data', (chunk:string) => fileStreamRes += chunk)
    fileStream.on('error', () => reject(`filepath "${filepath}" not found in gcp bucket "${bucket}"`))
})
