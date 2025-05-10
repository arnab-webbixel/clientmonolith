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
  },
  // new filed in V.0.0.1
   added_by: {
    user_id:   { type: String, required: true },               // e.g. "681b1ae471a27a4e603cafd4"
    role:      { type: String, required: true },               // "caller" or "admin"
    staffId:   { type: String },                               
    name:      { type: String },                               
    email:     { type: String }
  }

}, {
  timestamps: true
});

module.exports = mongoose.model('Pipeline', pipelineSchema);