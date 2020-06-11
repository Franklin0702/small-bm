import { partyWithAvatar } from '@/utils';

let title = 'General Ledger';

const viewConfig = {
  title,
  filterFields: [
    {
      fieldtype: 'Select',
      options: [
        { label: '', value: '' },
        { label: 'Venta', value: 'SalesInvoice' },
        { label: 'Compra', value: 'PurchaseInvoice' },
        { label: 'Pago', value: 'Payment' },
        { label: 'Entrada de Diario', value: 'JournalEntry' }
      ],
      size: 'small',
      label: 'Tipo de referencia',
      fieldname: 'referenceType',
      placeholder: 'Tipo de referencia'
    },
    {
      fieldtype: 'DynamicLink',
      size: 'small',
      placeholder: 'Nombre de referencia',
      references: 'referenceType',
      label: 'Nombre de referencia',
      fieldname: 'referenceName'
    },
    {
      fieldtype: 'Link',
      target: 'Account',
      size: 'small',
      placeholder: 'Cuenta',
      label: 'Cuenta',
      fieldname: 'account'
    },
    {
      fieldtype: 'Link',
      target: 'Party',
      label: 'Interesado (Cliente / Proveedor)',
      size: 'small',
      placeholder: 'Interesado (Cliente / Proveedor)',
      fieldname: 'party'
    },
    {
      fieldtype: 'Date',
      size: 'small',
      placeholder: 'Desde',
      label: 'Desde',
      fieldname: 'fromDate'
    },
    {
      fieldtype: 'Date',
      size: 'small',
      placeholder: 'Hasta',
      label: 'Hasta',
      fieldname: 'toDate'
    }
  ],
  method: 'general-ledger',
  linkFields: [
    {
      label: 'Clear Filters',
      type: 'secondary',
      action: async report => {
        await report.getReportData({});
        report.usedToReRender += 1;
      }
    },
    {
      label: 'Export',
      type: 'primary',
      action: () => {}
    }
  ],
  getColumns() {
    return [
      {
        label: 'Account',
        fieldtype: 'Link',
        fieldname: 'account'
      },
      {
        label: 'Date',
        fieldtype: 'Date',
        fieldname: 'date'
      },
      {
        label: 'Debit',
        fieldtype: 'Currency',
        fieldname: 'debit',
        width: 0.5
      },
      {
        label: 'Credit',
        fieldtype: 'Currency',
        fieldname: 'credit',
        width: 0.5
      },
      {
        label: 'Balance',
        fieldtype: 'Currency',
        fieldname: 'balance',
        width: 0.5
      },
      {
        label: 'Reference Type',
        fieldtype: 'Data',
        fieldname: 'referenceType'
      },
      {
        label: 'Reference Name',
        fieldtype: 'Data',
        fieldname: 'referenceName'
      },
      {
        label: 'Party',
        fieldtype: 'Link',
        fieldname: 'party',
        component(cellValue) {
          return partyWithAvatar(cellValue);
        }
      },
      {
        label: 'Description',
        fieldtype: 'Data',
        fieldname: 'description'
      }
    ];
  }
};

export default viewConfig;
