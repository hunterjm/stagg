import cfg from '../../config/ui'
export default () => <iframe src={cfg.docs.postman.url} style={{
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    width: '100vw', height: '100vh', zIndex: 999999,
}} />