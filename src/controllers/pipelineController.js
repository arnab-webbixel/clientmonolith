const pipelineService = require('../services/pipelineService');

const createPipeline = async (req, res) => {
  try {
    const pipeline = await pipelineService.createPipeline(req.body);
    res.status(201).json({ success: true, data: pipeline });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const getAllPipelines = async (req, res) => {
  try {
    const pipelines = await pipelineService.getAllPipelines();
    res.status(200).json({ success: true, data: pipelines });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getByStatus = async (req, res) => {
  try {
    const pipelines = await pipelineService.getPipelineByStatus(req.params.status);
    res.status(200).json({ success: true, data: pipelines });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const updatePipeline = async (req, res) => {
  try {
    const updated = await pipelineService.updatePipeline(req.params.id, req.body);
    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const deletePipeline = async (req, res) => {
  try {
    await pipelineService.deletePipeline(req.params.id);
    res.status(200).json({ success: true, message: 'Deleted successfully' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

module.exports = {
  createPipeline,
  getAllPipelines,
  getByStatus,
  updatePipeline,
  deletePipeline
};
