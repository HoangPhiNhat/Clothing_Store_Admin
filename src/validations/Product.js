import Joi from "joi";

export const cinemaValidator = Joi.object({
  name: Joi.string().required().min(2).max(255).messages({
    "string.base": "Tên sản phẩm không được để trống",
    "string.empty": "Tên sản phẩm không được để trống",
    "string.min": "Tên sản phẩm phải có ít nhất {#limit} ký tự",
    "string.max": "Tên sản phẩm không được vượt quá {#limit} ký tự",
    "any.required": "Tên sản phẩm không được để trống",
  }),
});
export const validateFieldNumber = (label, value) => {
  if (!value) {
    return Promise.reject(`Vui lòng nhập ${label}`);
  }
  if (!/^\d+$/.test(value)) {
    return Promise.reject(`Sai định dạng ${label}`);
  }
  return Promise.resolve();
};
