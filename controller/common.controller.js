
const commonService = require('../services/commonService');

exports.countryList = async (req, res) => {
    try {
        let data = await commonService.countryList();
        if (data.status == 0) {
            throw new Error(data.message);
        }else{
            res.status(200).json({
                message : data.message,
                response : data.response
            })
        }
    } catch (error) {
        res.status(403).json({ message: error.message });
    }
}

exports.stateList = async (req, res) => {
    try {
        let data = await commonService.stateList(req.body);
        if (data.status == 0) {
            throw new Error(data.message);
        }else{
            res.status(200).json({
                message : data.message,
                response : data.response
            })
        }
    } catch (error) {
        res.status(403).json({ message: error.message });
    }
}

exports.cityList = async (req, res) => {
    try {
        let data = await commonService.cityList(req.body);
        if (data.status == 0) {
            throw new Error(data.message);
        }else{
            res.status(200).json({
                message : data.message,
                response : data.response
            })
        }
    } catch (error) {
        res.status(403).json({ message: error.message });
    }
}