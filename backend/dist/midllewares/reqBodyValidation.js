import { validationResult, body } from 'express-validator';
export const user_ip_res_type_validator = [
    body('responseType')
        .trim()
        .notEmpty()
        .withMessage('Response type is required')
        .isIn(['text', 'audio'])
        .withMessage('Invalid response type'),
    body('user_input')
        .trim()
        .notEmpty()
        .withMessage('User input is required')
        .isString()
];
export const validate = (validations) => {
    return async (req, res, next) => {
        await Promise.all(validations.map(validation => validation.run(req))); // Run all validations
        const errors = validationResult(req);
        if (errors.isEmpty())
            return next();
        return res.status(422).json({ errors: errors.array() });
    };
};
//# sourceMappingURL=reqBodyValidation.js.map