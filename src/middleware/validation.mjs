import { badRequestError, getError } from '../errors/error.mjs';

export function validationMiddleware(schemas) {
    return (req, res, next) => {
        const pathSchema = schemas[req.path];
        if (pathSchema) {
            const schema = pathSchema[req.method];
            if (schema) {
                const { error } = schema.validate(req.body);
                req.validated = true;
                if (error) {
                    req.error_message = error.details[0].message;
                }
            }
        }
        next();
    };
}

export function valid(req, res, next) {
    if (req.validated && req.error_message) {
        throw badRequestError(req.error_message);
    }
    if (!req.validated && req._body) {
        throw getError(500, "Not validated")
    }
    next();
}