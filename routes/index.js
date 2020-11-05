const express = require('express');
const router = express.Router();
const axios = require('axios');

const getGeoInformation = async (ip) => {
  try {
    const params = {
      url: 'https://geo.ipify.org/api/v1',
      method: 'get',
      params: {
        apiKey: process.env.GEO_IPIFY_API_KEY,
        ipAddress: ip
      }
    };
    const geoInfoResponse = await axios(params);

    return geoInfoResponse.data;
  } catch (err) {
    console.log('ERROR: ', err);
    throw err;
  }
};

router.get('/', async (req, res, next) => {
  try {
    const geoInfo = await getGeoInformation(req.ip);
    const location = geoInfo.location;
    const params = {
      url: 'https://api.openweathermap.org/data/2.5/onecall',
      method: 'get',
      params: {
        lat: location.lat,
        lon: location.lng,
        units: req.query.unit,
        exclude: 'minutely',
        appid: process.env.OWM_API_KEY
      }
    };
    const response = await axios(params);

    return res.status(200).json({ status: 'success', data: { location: location, weatherData: response.data } });
  } catch (err) {
    // console.error('ERROR: ', err);
    return res.status(500).json({
      status: 'Error',
      message: err.message
    });
  }
});

module.exports = router;
