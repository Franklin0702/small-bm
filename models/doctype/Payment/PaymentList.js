import { _ } from 'frappejs/utils';
import Badge from '@/components/Badge';

export default {
  doctype: 'Payment',
  title: _('Payments'),
  columns: [
    'party',
    {
      label: 'Estado',
      fieldname: 'status',
      fieldtype: 'Select',
      size: 'small',
      render(doc) {
        let status = 'pendiente';
        let color = 'gray';
        if (
          doc.submitted === 1 &&
          (doc.clearanceDate !== null || doc.paymentMethod === 'Cash')
        ) {
          color = 'green';
          status = 'hecho';
        }

        return {
          template: `<Badge class="text-xs" color="${color}">${status}</Badge>`,
          components: { Badge }
        };
      }
    },
    {fieldname: 'paymentType', label:'Tipo de pago'},
    {fieldname: 'date', label:'Fecha'},
    {fieldname: 'amount', label: 'Monto'}
  ]
};
