const frappe = require('frappejs');
const { _ } = require('frappejs/utils');
const router = require('@/router').default;

module.exports = {
  name: 'AdjustSalesInvoice',
  label: 'Nota de Crédito',
  basedOn: 'SalesInvoice',
  filters: {
    voucherType: 'Nota de Crédito'
  }
 
};
