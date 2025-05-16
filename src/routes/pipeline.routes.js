const express = require('express');
const router = express.Router();
const pipelineController = require('../controllers/pipelineController');
const auth =  require('../middleware/auth');
router.get('/', pipelineController.getAllPipelines);
router.post('/', auth, pipelineController.createPipeline);
router.get('/status/:status', pipelineController.getByStatus);
router.put('/:id', pipelineController.updatePipeline);
router.delete('/:id', pipelineController.deletePipeline);

module.exports = router;
