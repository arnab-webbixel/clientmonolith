const mongoose = require('mongoose');

const pipelineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['High', 'Medium', 'Low'],
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  company_name: {
    type: String,
    required: true
  },
  pipeline_status: {
    type: String,
    enum: ['Negotiation', 'Ongoing', 'Won', 'Closed', 'Cancelled'],
    default: 'Negotiation'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Pipeline', pipelineSchema);