import { _ } from 'frappejs/utils';
import { getStatusColumn } from '../Transaction/Transaction';

export default {
  doctype: 'PurchaseInvoice',
  title: _('Compras'),
  formRoute: name => `/edit/PurchaseInvoice/${name}`,
  columns: [
    { fieldname: 'supplier', label: 'Proveedor' },
    { fieldname: 'name', label: 'Número' },
    getStatusColumn('PurchaseInvoice'),
    { fieldname: 'date', label: 'Fecha' },
    { fieldname: 'grandTotal', label: 'Total' },
    { fieldname: 'outstandingAmount', label: 'Monto Pendiente' },
    { fieldname: 'voucherSerie', label: 'NCF' }
  ]
};
