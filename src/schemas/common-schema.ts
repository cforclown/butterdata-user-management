import Joi from 'joi';

export const ObjectIdSchema = Joi.object({
  objectId: Joi.string().required()
});
