const model = require('frappejs/model');
const Quotation = require('../Quotation/Quotation');

module.exports = model.extend(Quotation, {
  name: 'Fulfillment',
  label: 'Cumplimiento',
  settings: 'FulfillmentSettings',
  fields: [
    {
      fieldname: 'items',
      childtype: 'FulfillmentItem'
    }
  ]
});
