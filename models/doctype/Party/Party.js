const frappe = require('frappejs');
let { _ } = require('frappejs/utils');

module.exports = {
  name: 'Party',
  label: 'Persona',
  keywordFields: ['name'],
  fields: [
    {
      fieldname: 'name',
      label: 'Nombre',
      fieldtype: 'Data',
      required: 1,
      placeholder: 'Nombre Completo'
    },
    {
      fieldname: 'image',
      label: 'Imagen',
      fieldtype: 'AttachImage'
    },
    {
      fieldname: 'customer',
      label: 'Cliente',
      fieldtype: 'Check'
    },
    {
      fieldname: 'supplier',
      label: 'Proveedor',
      fieldtype: 'Check'
    },
    {
      fieldname: 'defaultAccount',
      label: 'Cuenta por defecto',
      fieldtype: 'Link',
      target: 'Account',
      getFilters: (query, doc) => {
        return {
          isGroup: 0,
          accountType: doc.customer ? 'Receivable' : 'Payable'
        };
      },
      formula: doc => {
        if (doc.customer) {
          return 'Debtors';
        }
        if (doc.supplier) {
          return 'Creditors';
        }
      }
    },
    {
      fieldname: 'outstandingAmount',
      label: 'Monto Pendiente',
      fieldtype: 'Currency'
    },
    {
      fieldname: 'currency',
      label: 'Moneda',
      fieldtype: 'Link',
      target: 'Currency',
      placeholder: 'DOP',
      formula: () => frappe.AccountingSettings.currency
    },
    {
      fieldname: 'email',
      label: 'Correo',
      fieldtype: 'Data',
      placeholder: 'juan@pérez.com',
      validate: {
        type: 'email'
      }
    },
    {
      fieldname: 'phone',
      label: 'Teléfono',
      fieldtype: 'Data',
      placeholder: 'Teléfono',
      validate: {
        type: 'phone'
      }
    },
    {
      fieldname: 'address',
      label: 'Dirección',
      fieldtype: 'Link',
      target: 'Address',
      placeholder: _('Clic para crear'),
      inline: true
    },
    {
      fieldname: 'addressDisplay',
      label: 'Dirección a mostrar',
      fieldtype: 'Text',
      readOnly: true,
      formula: doc => {
        if (doc.address) {
          return doc.getFrom('Address', doc.address, 'addressDisplay');
        }
      }
    },
    {
      fieldname: 'document',
      label: 'RNC / Cedula',
      fieldtype: 'Data',
      required: true
    },
    {
      fieldname: 'businessName',
      label: 'Razon Comercial / Nombre del Cliente',
      fieldtype: 'Data',
      required: true
    },
    {
      fieldname: 'tradename',
      label: 'Nombre Comercial',
      fieldtype: 'Data',
      required: false
    }
  ],

  quickEditFields: [
    'businessName',
    'document',
    'tradename',
    'email',
    'phone',
    'address',
    'defaultAccount',
    'currency'
  ]
};
