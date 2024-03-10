const { Joi } = require("celebrate");

let common = {
    STATELIST: Joi.object().keys({
        country_code:Joi.string().required(),
    }),
    CITYLIST: Joi.object().keys({
        country_code:Joi.string().required(),
        state_code:Joi.string().required()
    }),
}

module.exports = common;