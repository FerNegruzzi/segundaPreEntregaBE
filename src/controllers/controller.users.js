const { Router } = require('express')
// const Users = require('../../dao/models/Users.model')
const passport = require('passport')
const UserDAO = require('../dao/Users.dao')
const UserServ = require('../services/users.service')
const logger = require('../utils/logger.utils')
const uploader = require('../utils/multer.utils')


const Users = new UserDAO()

const router = Router()

router.post('/', passport.authenticate('signup', { session: false }),
    async (req, res) => {
        try {
            logger.info('User registred')
            res.status(201).json({ status: 'succes', message: 'user registred', user: req.user })
        } catch (error) {
            logger.error('Error al crear usuario')
            res.status(500).json({ status: 'error', error: 'Internal server error' })
        }
    })


router.get('/premium/:uid', async (req, res) => {
    try {
        const user = await Users.getOneById(req.params.uid)

        if (user.role === 'admin') {
            throw new Error('Unauthorized')
        }

        const reqDocuments = ['product', 'profile', 'document'];
        const userDocuments = user.documents.map((item) => { path.basename(item.name, path.extname(item.name)) })

        const cumpleRequisitoDocumentos = reqDocuments.every((item) => { userDocuments.incluides(item) })

        if (!cumpleRequisitoDocumentos) {
            throw new Error('Error de documentos')
        }

        const changeRole = UserServ.changeUserRole(user)
        logger.info('Se cambio el rol de usuario', changeRole)
        res.json({ user: user.role })

        // me logea rol user pero en la base de datos se guarda pemium
        console.log(user.role);
    } catch (error) {
        logger.error('Error al cambiar de rol', error)
    }
})

router.post('/:uid/documents', uploader.any(), async (req, res) => {
    try {
        const { uid } = req.params
        const user = await Users.getOneById(uid)
        const newDocument = req.files.map((file) => ({
            name: file.originalname,
            reference: file.filename
        }))
        user.documents.push(...newDocument)
        await user.save()
        logger.info('Document saved', newDocument.name)
        res.json({ message: 'Document saved' })
    } catch (error) {
        logger.error('error', error)
        res.status(500).json({ message: 'Error' })
    }
})

router.get('/failRegister', (req, res) => {
    logger.error('strategy failed');
    res.json({ error: 'Failed signup' })
})

router.delete('/', async (req, res) => {
    await Users.deleteAllOnlyForDevs()
    res.json({ message: 'All users deleted' })
})


module.exports = router