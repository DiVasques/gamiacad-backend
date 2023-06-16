import { Joi } from 'celebrate'

export const StandardOptionsJoi = Joi.defaults((schema) => {
  switch (schema.type) {
    case 'object':
      return schema.options({ abortEarly: false })
    default:
      return schema
  }
})
