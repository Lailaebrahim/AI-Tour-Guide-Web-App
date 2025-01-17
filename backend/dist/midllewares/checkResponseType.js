import { validationResult, body } from 'express-validator';
export const responseTypeValidator = [
    body('responseType')
        .trim()
        .notEmpty()
        .withMessage('Response type is required')
        .isIn(['text', 'audio'])
        .withMessage('Invalid response type'),
    body('user_input')
        .trim()
        .isEmpty()
        .withMessage('User input is required')
        .isString()
];
const validate = (validations) => {
    return async (req, res, next) => {
        for (let validation of validations) {
            const result = await validation.run(req);
            if (!result.isEmpty())
                break;
        }
        const errors = validationResult(req);
        if (errors.isEmpty())
            return next();
        return res.status(422).json({ errors: errors.array() });
    };
};
//# sourceMappingURL=checkResponseType.js.map