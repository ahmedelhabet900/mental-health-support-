import joi from "joi";

export const submitMoodSchema = joi
  .object({
    answers: joi
      .array()
      .items(joi.number().integer().min(0).max(3))
      .length(3)
      .required(),
  })
  .required();

export const historySchema = joi
  .object({
    page: joi.number().integer().min(1),
    limit: joi.number().integer().min(1).max(50),
  })
  .required();