import { download } from '../../api'
export default download
export const config = {
    api: {
        bodyParser: false // disable bodyParser for stream
    }
}