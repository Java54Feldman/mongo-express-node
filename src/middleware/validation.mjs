import { badRequestError } from '../errors/error.mjs';
import Joi from 'joi'

const schemas = {
    "/mflix/comments": {
        PUT: Joi.object({
            commentId: Joi.string().hex().length(24).required(),
            text: Joi.string().required(),
        }),
        POST: Joi.object({
            movie_id: Joi.string().hex().length(24).required(),
            name: Joi.string().alphanum(),
            email: Joi.string().email(),
            text: Joi.string().required(),
            
        }),
    },
    "/mflix/movies/rated": {
        POST: Joi.object({
            year: Joi.number().integer().min(1900).max(2024),
            genre: Joi.string(),
            actor: Joi.string(),
            amount: Joi.number().integer().min(1).required(),
        }),
    },
};

export function validationMiddleware() {
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
    next();
}