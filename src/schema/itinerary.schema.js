import Joi from "joi";

export const itineraryCreateValidation = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  destination: Joi.string().min(2).max(100).required(),
  startDate: Joi.date().iso().required(),
  endDate: Joi.date().iso().required(),
  activities: Joi.array()
    .items(
      Joi.object({
        time: Joi.string().required(),
        description: Joi.string().min(3).max(200).required(),
        location: Joi.string().min(2).max(100).required()
      })
    )
    .default([])
}).unknown(false);



export const itineraryUpdateValidation = Joi.object({
  title: Joi.string().min(3).max(100),
  destination: Joi.string().min(2).max(100),
  startDate: Joi.date().iso(),
  endDate: Joi.date().iso(),
  activities: Joi.array().items(
    Joi.object({
      time: Joi.string(),
      description: Joi.string().min(3).max(200),
      location: Joi.string().min(2).max(100)
    })
  )
}).min(1).unknown(false);
