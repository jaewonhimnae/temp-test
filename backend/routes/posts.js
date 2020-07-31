const express = require('express');
const router = express.Router();
const apiKey = process.env.API_KEY;
const baseUrl = "http://info.sweettracker.co.kr"
const axios = require('axios');
//=================================
//             Posts APIs
//=================================

router.get("/companylist", async (req, res) => {
    try {
        let results = await axios.get(`${baseUrl}/api/v1/companylist?t_key=${apiKey}`)
        res.status(200).send(results.data.Company);
    } catch (error) {
        console.error(error)
        res.status(500).send(error);
    }
});

router.get("/trackingInfo", async (req, res) => {
    try {
        let results = await axios.get(`${baseUrl}/api/v1/trackingInfo?t_key=${apiKey}&t_code=${req.query.tCode}&t_invoice=${req.query.tInvoice}`)
        res.status(200).send(results.data.trackingDetails);
    } catch (error) {
        console.error(error)
        res.status(500).send(error);
    }
});

module.exports = router;
