import Joi from 'joi';

export const userSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    confirmPassword: Joi.string().required().equal(Joi.ref('password'))
});

export const signInSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
})