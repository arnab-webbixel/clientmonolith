const pipelineService = require('../services/pipelineService');

const createPipeline = async (req, res) => {
  try {
    const { name, type, price, company_name , pipeline_status } = req.body;
    const { user_id, role, staffId, staffName, email } = req.user;
    const newPipeline = await pipelineService.createPipeline({
      name,
      type,
      price,
      company_name,
      pipeline_status,  
      added_by: {
        user_id,
        role,
        staffId,          // if you prefer the DB id
        name: staffName,  // snapshot so you don’t need extra calls later
        email
      }
    });

    res.status(201).json({
      success: true,
      data: newPipeline
    });
  } catch (err) {
    console.log(err)
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
  console.log(req.body)
  console.log(req.params.id)
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
