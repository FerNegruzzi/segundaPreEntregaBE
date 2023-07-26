const {Router} = require('express')
const router = Router()

router.get('/', (req, res) => {
  req.logger.debug('Nivel Debug')
  req.logger.info('Nivel Info')
  req.logger.warning('Nivel Warning')
  req.logger.error('Nivel Error')
  req.logger.fatal('Nivel Fatal')

  res.json('Prueba de logs exitosa')
})

module.exports = router