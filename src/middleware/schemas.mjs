import Joi from 'joi'
export const schemas = {
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