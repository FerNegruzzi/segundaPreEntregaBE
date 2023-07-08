class MessageRepository {
    constructor(messageTool){
        this.messageTool = messageTool
    }

    async sendMessage(newUserInfo){
        await this.messageTool.sendMessage(newUserInfo)
    }
}

module.exports = MessageRepository