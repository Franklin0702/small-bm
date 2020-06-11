const frappe = require('frappejs');
module.exports = {
  name: 'PaymentFor',
  label: 'Pagar por',
  isSingle: 0,
  isChild: 1,
  keywordFields: [],
  tableFields: [
    'referenceType',
    'referenceName',
    'amount'
  ],
  fields: [
    {
      fieldname: 'referenceType',
      label: 'Tipo de referencia',
      fieldtype: 'AutoComplete',
      options: ['SalesInvoice', 'PurchaseInvoice'],
      required: 1
    },
    {
      fieldname: 'referenceName',
      label: 'Tipo de referencia',
      fieldtype: 'DynamicLink',
      references: 'referenceType',
      required: 1
    },
    {
      fieldname: 'amount',
      label: 'Monto',
      fieldtype: 'Currency',
      formula: async (row, doc) => {
    
        return doc.getFrom(row.referenceType, row.referenceName, 'outstandingAmount');
      },
      required: 1
    }
  ]
};
