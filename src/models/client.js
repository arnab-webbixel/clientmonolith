const mongoose = require('mongoose');

const remarkSchema = new mongoose.Schema({
  comment: {
      type: String,
      required: true,
  },
  date: {
      type: Date,
      default: Date.now,
  },
});


const clientSchema = new mongoose.Schema({
  name:{
    type: String,
    required: true,
  },
  company_name: {
      type: String,
      required: true,
  },
  phone: {
      type: String,
      required: true,
      unique: true
  },
  email: {
      type: String,
      required: true,
  },
  address: {
      type: String,
      required: true,
  },
  landmark: {
      type: String,
  },
  website: {
      type: String,
  },
  industry_type: {
      type: String,
      required: true,
  },
  service_type: {
      type: String,
      required: true,
  },
  call_type: {
      type: String,
      enum: ['archive', 'warm-call', 'hot-call', 'follow-up'], 
      required: true,
  },
  remarks: {
      type: [remarkSchema],
      default: [],
  },
  schedule_date: {
      type: Date,
      default: null,
  },
  status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Follow-Up', 'Closed'],
      default: 'Pending',
  },
  customer_id: {
      type: String, 
     default : null
  },
   added_by: {
    id: { type: String, required: true },
    role: { type: String, enum: ['admin', 'staff'], required: true },
    name: { type: String },
    email: { type: String }
  }
}, {
  timestamps: true, 
});

module.exports = mongoose.model('Clients', clientSchema);