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

router.get('/', async (req, res) => {
    try {
        const users = await Users.getAll()
        const usersInfo = users.map(user => ({
            name: user.first_name,
            email: user.email,
            rol: user.role
        }));
        res.status(200).json({ message: 'Usuarios obtenidos exitosamente', users: usersInfo })
        logger.info('Todos los usuarios se trajeron con exito', usersInfo)
    } catch (error) {
        logger.error('Error al traer todos los usuarios', error)
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

router.delete('/deleteForDevs', async (req, res) => {
    await Users.deleteAll()
    res.json({ message: 'All users deleted' })
})

router.delete('/', async (req, res) => {
    try {
        const currentDate = new Date()
        const twoDaysAgo = new Date()
        twoDaysAgo.setDate(currentDate.getDate() - 2)

        const inactiveUsers = await Users.deleteAll(twoDaysAgo).catch(error => {
            logger.error('Error al eliminar los usuarios', error)
            throw error
        })

        if (inactiveUsers) {
            const deletedCount = inactiveUsers.deletedCount || 0
            res.status(200).json({ message: 'Usuarios inactivos eliminados con exito', deletedCount })
        } else {
            res.status(200).json({ message: 'Ningún usuario inactivo fue encontrado', deletedCount: 0 })
        }
    } catch (error) {
        logger.error('Error al eliminar usuarios inactivos', error)
        res.status(500).json({ message: 'Error al eliminar usuarios inactivos' })
    }
})

router.get('/deleteUser/:uid', async (req, res, next) => {
    try {
      const userId = req.params.uid
      const user = await Users.getOneById({id: userId})
      await Users.deleteOne({id: userId})
  
      res.status(201).json({message: `Usuario ${user.email} eliminado`})
    } catch (error) {
      next(error)
    }
  
  })
module.exports = router