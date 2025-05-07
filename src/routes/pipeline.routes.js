const express = require('express');
const router = express.Router();
const pipelineController = require('../controllers/pipelineController');

router.get('/', pipelineController.getAllPipelines);
router.post('/', pipelineController.createPipeline);
router.get('/status/:status', pipelineController.getByStatus);
router.put('/:id', pipelineController.updatePipeline);
router.delete('/:id', pipelineController.deletePipeline);

module.exports = router;
