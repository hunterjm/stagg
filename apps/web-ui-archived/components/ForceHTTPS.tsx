export default () => {
    try {
        const isHTTPS = window.location.href.includes('https')
        const isLocalHost = window.location.href.match(/^http:\/\/localhost/i)
        if (!isHTTPS && !isLocalHost) {
            window.location.href = window.location.href.replace(/^http/, 'https')
        }
    } catch(e) {}
    return <></>
}