import { _ } from 'frappejs/utils';
import { getStatusColumn } from '../Transaction/Transaction';

export default {
  doctype: 'AdjustSalesInvoice',
  title: _('Notas de crédito'),
  formRoute: name => `/edit/AdjustSalesInvoice/${name}`,
  columns: [
    {fieldname: 'customer', label: 'Cliente'},
    {fieldname: 'name', label: 'Número'},
    {fieldname: 'voucherSerie', label:'NCF'},
    getStatusColumn('SalesInvoice'),
    {fieldname: 'date', label: 'Fecha'},
    {fieldname: 'grandTotal', label: 'Total'},
    {fieldname: 'outstandingAmount', label:'Monto Pendiente'},
  ]
};
