import { _ } from 'frappejs/utils';
import { getStatusColumn } from '../Transaction/Transaction';

export default {
  doctype: 'AdjustSalesInvoice',
  title: _('Notas de crédito'),
  formRoute: name => `/credit/AdjustSalesInvoice/${name}`,
  columns: [
    { fieldname: 'customer', label: 'Cliente' },
    { fieldname: 'name', label: 'Número' },
    { fieldname: 'voucherSerie', label: 'NCF' },
    { fieldname: 'date', label: 'Fecha' },
    { fieldname: 'grandTotal', label: 'Total' },
    getStatusColumn('AdjustSalesInvoice'),
  ]
};
