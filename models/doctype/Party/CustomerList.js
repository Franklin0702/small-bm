import { _ } from 'frappejs/utils';

export default {
  doctype: 'Customer',
  title: _('Clientes'),
  columns: [
    { fieldname: 'name', label: 'Nombre' },
    { fieldname: 'phone', label: 'teléfono' },
    { fieldname: 'outstandingAmount', label: 'Monto Pendiente' }
  ]
};
