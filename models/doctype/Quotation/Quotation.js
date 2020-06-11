const model = require('frappejs/model');
const SalesInvoice = require('../SalesInvoice/SalesInvoice');

const Quotation = model.extend(
  SalesInvoice,
  {
    name: 'Quotation',
    label: 'Cotización',
    settings: 'QuotationSettings',
    fields: [
      {
        fieldname: 'items',
        childtype: 'QuotationItem'
      }
    ],
    links: []
  },
  {
    skipFields: ['account'],
    overrideProps: ['links']
  }
);

module.exports = Quotation;
