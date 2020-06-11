import { _ } from 'frappejs/utils';

export default {
  doctype: 'Supplier',
  title: _('Proveedores'),
  columns: [
    { fieldname: 'name', label: 'Proveedor' },
    { fieldname: 'phone', label: 'teléfono' },
    { fieldname: 'outstandingAmount', label: 'Monto Pendiente' }
  ]
};
