const errorCallbacks = {
    default: res => {
        console.error(`Unhandled http error with status code ${res.status}`)
        console.error(res)
        return res
    }
}
const httpRequest = async (url,
    method = 'GET',
    headers = new Headers(),
    body = '',
    callbacks = errorCallbacks
) => {
    let request
    if (body) request = { method, headers, body }
    else request = { method, headers }

    const res = await fetch(url, request)
    if (res.ok) return res
    else {
        if (res.status in callbacks) return callbacks[res.status](res)
        else if ('default' in callbacks) return callbacks.default(res)
        else {
            console.warn(`Warning, unhandled ${res.status} status code`)
            return res
        }
    }
}

export { httpRequest }
