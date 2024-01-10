const logger = (req, res, next) => {
    const { url, ip, method } = req
    
    console.log(`${new Date().toISOString()} ${method} request dubmitted to endpoint ${url} from address: ${ip}`)

    next()
}

export default logger