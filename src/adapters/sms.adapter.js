const twilio = require("twilio");
const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_SMS_NUMBER } = require("../utils/sms.util");

class SmsAdapter {
    async sendMessage(newUserInfo) {
        const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

        await client.messages.create({
            body: `Felicitaciones ${newUserInfo.name} ! te has registrado en nuestra pagina web`,
            from: TWILIO_SMS_NUMBER,
            to: newUserInfo.phone
        })
    }
}

module.exports = SmsAdapter