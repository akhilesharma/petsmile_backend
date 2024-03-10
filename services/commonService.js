
var csc = require('country-state-city').default// Returns an array of country names.

exports.countryList = async () => {
    try {
        let country = await csc.getAllCountries();
        // console.log(country);
        if(!country){
            return{
                status:0,
                message:"Something Went Wrong"
            }
        }
        return {
            message:"Countries list fetch",
            response:country
        }
    } catch (error) {
        throw new Error(error.message);
    }
};


exports.stateList = async (body) => {
    try {
        let state = await csc.getStatesOfCountry(body.country_code);
        if(!state){
            return{
                status:0,
                message:"Something Went Wrong"
            }
        }
        return {
            message:"State list fetch",
            response:state
        }
    } catch (error) {
        throw new Error(error.message);
    }
};

exports.cityList = async (body) => {
    try {
        let city = await csc.getCitiesOfState(body.country_code,body.state_code);
        if(!city){
            return{
                status:0,
                message:"Something Went Wrong"
            }
        }
        return {
            message:"City list fetch",
            response:city
        }
    } catch (error) {
        throw new Error(error.message);
    }
};