import { _ } from 'frappejs/utils';

export default {
  doctype: 'Item',
  title: _('Productos'),
  columns: [
    { fieldname: 'name', label: 'producto' },
    { fieldname: 'unit', label: 'unidad' },
    { fieldname: 'tax', label: 'impuestos' },
    { fieldname: 'rate', label: 'precio' }
  ]
};
