import { _ } from 'frappejs/utils';
import { getStatusColumn } from '../Transaction/Transaction';

export default {
  doctype: 'SalesInvoice',
  title: _('Facturas'),
  formRoute: name => `/edit/SalesInvoice/${name}`,
  columns: [
    { fieldname: 'customer', label: 'Cliente' },
    { fieldname: 'name', label: 'Número' },
    getStatusColumn('SalesInvoice'),
    { fieldname: 'date', label: 'Fecha' },
    { fieldname: 'grandTotal', label: 'Total' },
    { fieldname: 'outstandingAmount ', label: 'Monto Pendiente' },
    { fieldname: 'voucherSerie', label: 'NCF' }
  ]
};
