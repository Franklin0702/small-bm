import { _ } from 'frappejs/utils';

export default {
  doctype: 'VoucherType',
  title: _('Tipos de comprobante'),
  columns: [
    { fieldname: 'name', label: 'Nombre' },
    { fieldname: 'code', label: 'Codigo' },
    { fieldname: 'description', label: 'Descripción' },
    { fieldname: 'useOn', label: 'Modulo' }
  ]
};
