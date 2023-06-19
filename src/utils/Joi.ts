import { Joi } from 'celebrate'

export const StandardOptionsJoi = Joi.defaults((schema) => {
  if (schema.type === 'object') {
    return schema.options({ abortEarly: false })
  }
  return schema
})
