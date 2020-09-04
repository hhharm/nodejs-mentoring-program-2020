
import * as Joi from "@hapi/joi";

const permission = Joi.string().pattern(new RegExp("READ|WRITE|DELETE|SHARE|UPLOAD_FILES"));
export const GroupCreateSchema = Joi.object({
    name: Joi.string().required(),
    permissions: Joi.array().items(permission)
});

export const GroupUsersSchema = Joi.object({
    ids: Joi.array().items(Joi.string()).required()
});

export const GroupUpdateSchema = GroupCreateSchema.keys({
    id: Joi.string().guid().required()
});
