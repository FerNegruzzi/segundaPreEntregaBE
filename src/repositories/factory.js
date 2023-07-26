const { envirorment } = require("../config/app.config");

switch (envirorment) {
    case 'prod':
        console.log('prod');
        module.exports = require('../adapters/sms.adapter')
        break;

    case 'dev':
        console.log('dev');
        module.exports = require('../adapters/mail.adapter')
        break;
}
