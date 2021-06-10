const Joi = require("joi-plus");

module.exports = Joi.object({
    name: Joi.string().escape().min(6).required(),
    tpnumber: Joi.string().numeric().escape().required()
})