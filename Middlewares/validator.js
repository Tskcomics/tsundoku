import { body, validationResult } from "express-validator"

const params = [
    body("title").isString().notEmpty().withMessage("title must be a string"),
    body("content").isString().notEmpty().isLength({ min: 12 }).withMessage("content must be a string"),
    body("category").isString().notEmpty().withMessage("category must be a string")
]

const validator = (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    next()
}

export { params, validator }