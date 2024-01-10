const validateUser = (req, res, next) => {
    const errors = []

    const { username, password } = req.body

    if (typeof username !== "string" || username.length < 3) {
        errors.push('Lo username deve essere una stringa di almeno 3 caratteri')
    }

    if (typeof password !== "string" || password.length < 8) {
        errors.push('La password deve essere una stringa di almeno 8 caratteri')
    }

    if (errors.length > 0) {
        res.status(400).send({ errors })
    } else {
        next()
    }
}

export default validateUser