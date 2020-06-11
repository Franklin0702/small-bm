const model = require('frappejs/model');
const Quotation = require('../Quotation/Quotation');

module.exports = model.extend(Quotation, {
  name: 'SalesOrder',
  label: 'Orden de venta',
  settings: 'SalesOrderSettings',
  fields: [
    {
      fieldname: 'items',
      childtype: 'SalesOrderItem'
    }
  ]
});
