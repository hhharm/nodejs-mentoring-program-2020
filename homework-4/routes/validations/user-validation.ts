
import * as Joi from "@hapi/joi";

// Login rules: from 8 to 20 symbols,
// allowed only alphanum or . or _,
// . or _ cannot follow . or _,
// cannot start or end with _ or .
const loginPattern = new RegExp("^(?=[a-zA-Z0-9._]{8,20}$)(?!.*[_.]{2})[^_.].*[^_.]$");
export const UserCreateSchema = Joi.object({
    login: Joi.string().regex(loginPattern).required(),
    password: Joi.string().alphanum().required(),
    isDeleted: Joi.boolean().required(),
    age: Joi.number().min(4).max(130).required()
});

export const UserUpdateSchema = UserCreateSchema.keys({
    id: Joi.string().guid().required()
});
