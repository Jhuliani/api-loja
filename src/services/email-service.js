'use strict'

let config = require('../config');
let sendgrid = require('sendgrid')(config.sendgridkey);

exports.send = async(to, subject, body) => {
    sendigrid.send({
        to: to,
        from: 'hello@gmail.com',
        subject: subject,
        html: body
    });
}