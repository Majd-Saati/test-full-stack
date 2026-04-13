const { Router } = require('express');
const productController = require('../controllers/product.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = Router();

router.use(authMiddleware);

router.get('/', productController.list);
router.get('/:id', productController.getById);
router.post('/', productController.create);
router.patch('/:id', productController.update);
router.delete('/:id', productController.remove);

module.exports = router;
