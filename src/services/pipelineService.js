const Pipeline = require('../models/Pipeline');

const createPipeline = async (data) => {
  const pipeline = new Pipeline(data);
  return await pipeline.save();
};

const getAllPipelines = async () => {
  return await Pipeline.find();
};

const getPipelineByStatus = async (status) => {
  return await Pipeline.find({ pipeline_status: status });
};

const updatePipeline = async (id, data) => {
  return await Pipeline.findByIdAndUpdate(id, data, { new: true });
};

const deletePipeline = async (id) => {
  return await Pipeline.findByIdAndDelete(id);
};

module.exports = {
  createPipeline,
  getAllPipelines,
  getPipelineByStatus,
  updatePipeline,
  deletePipeline
};
