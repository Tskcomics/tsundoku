const isAuthorized = (req, res, next) => {
    const { role } = req.body

    if (role !== 'admin') {
        return res.status(400).send({
            statusCode: 400,
            message: "User not authorized."
        })
    }
    next()
}

export default isAuthorized