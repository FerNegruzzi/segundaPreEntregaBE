const { envirorment } = require("../config/app.config");

switch (envirorment) {
    case 'production':
        console.log('envio con email');
        module.exports = require('../adapters/mail.adapter')
        break;

    case 'testing':
        console.log('envio con sms');
        module.exports = require('../adapters/sms.adapter')
        break;
}