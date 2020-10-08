const User = require('../models/user');
const braintree = require('braintree');
require('dotenv').config();

const gateway = braintree.connect({
    environment: braintree.Environment.Sandbox, // Production
    merchantId: '39w83xskxfb335dc',
    publicKey: '7j62jzwm7yrhsv33',
    privateKey: 'e35fbd8934d46510335bf0ce1210ec21'
});

exports.generateToken = (req, res) => {
    gateway.clientToken.generate({}, function(err, response) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(response);
        }
    });
};

exports.processPayment = (req, res) => {
    let nonceFromTheClient = req.body.paymentMethodNonce;
    let amountFromTheClient = req.body.amount;
    // charge
    let newTransaction = gateway.transaction.sale(
        {
            amount: amountFromTheClient,
            paymentMethodNonce: nonceFromTheClient,
            options: {
                submitForSettlement: true
            }
        },
        (error, result) => {
            if (error) {
                res.status(500).json(error);
            } else {
                res.json(result);
            }
        }
    );
};
