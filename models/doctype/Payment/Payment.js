const utils = require('../../../accounting/utils');

module.exports = {
  name: 'Payment',
  label: 'Pago',
  isSingle: 0,
  isChild: 0,
  isSubmittable: 1,
  keywordFields: [],
  settings: 'PaymentSettings',
  fields: [
    {
      fieldname: 'party',
      label: 'Interesado (Cliente/Proveedor)',
      fieldtype: 'Link',
      target: 'Party',
      required: 1
    },
    {
      fieldname: 'date',
      label: 'Fecha de publicación',
      fieldtype: 'Date',
      defaultValue: new Date().toISOString()
    },
    {
      fieldname: 'account',
      label: 'Cuenta origen',
      fieldtype: 'Link',
      target: 'Account',
      required: 1,
      getFilters: (query, doc) => {
        if (doc.paymentType === 'Pago') {
          if (doc.paymentMethod === 'Efectivo') {
            return { accountType: 'Cash', isGroup: 0 };
          } else {
            return { accountType: ['in', ['Bank', 'Cash']], isGroup: 0 };
          }
        }
      }
    },
    {
      fieldname: 'paymentType',
      label: 'Tipo de Pago',
      fieldtype: 'Select',
      options: ['', 'Cobro', 'Pago'],
      required: 1
    },
    {
      fieldname: 'paymentAccount',
      label: 'Cuenta destino',
      placeholder: 'Cuenta destino',
      fieldtype: 'Link',
      target: 'Account',
      required: 1,
      getFilters: (query, doc) => {
        if (doc.paymentType === 'Cobro') {
          if (doc.paymentMethod === 'Efectivo') {
            return { accountType: 'Cash', isGroup: 0 };
          } else {
            return { accountType: ['in', ['Bank', 'Cash']], isGroup: 0 };
          }
        }
      },
      formula: doc => {
        if (doc.paymentMethod === 'Efectivo') {
          return 'Cash';
        }
      }
    },
    {
      fieldname: 'paymentMethod',
      label: 'Método de Pago',
      placeholder: 'Método de Pago',
      fieldtype: 'Select',
      options: ['', 'Efectivo', 'Cheque', 'Transferencia', 'Nota de crédito'],
      required: 1
    },
    {
      fieldname: 'referenceId',
      label: 'Ref. / Num. Cheque',
      placeholder: 'Ref. / Num. Cheque',
      fieldtype: 'Data',
      required: 1 // TODO: UNIQUE
    },
    {
      fieldname: 'referenceDate',
      label: 'Fecha de referencia',
      placeholder: 'Fecha de referencia',
      fieldtype: 'Date'
    },
    {
      fieldname: 'clearanceDate',
      label: 'Fecha de liquidación',
      placeholder: 'Fecha de liquidación',
      fieldtype: 'Date',
      hidden: doc => {
        return doc.paymentMethod === 'Efectivo' ? 1 : 0;
      }
    },
    {
      fieldname: 'amount',
      label: 'Monto',
      fieldtype: 'Currency',
      required: 1,
      readOnly: 1,
      formulaDependsOn: ['paymentMethod'],
      formula: async doc => {
        
        if (doc.paymentMethod === 'Nota de crédito' && doc.referenceId && doc.referenceId !== '') {
          const frappe = require('frappejs'); 
          let document = await frappe.db.getAll({
            doctype: 'SalesInvoice',
            fields: [
              'name',
              'date',
              'customer',
              'account',
              'netTotal',
              'grandTotal',
              'outstandingAmount',
              'voucherSerie'
            ],
            filters: {
              voucherSerie: doc.referenceId,
              voucherType: 'Nota de Crédito'
            }
          });
          if (document.length === 1)
            return document[0].grandTotal;
          else
            throw new frappe.errors.throw(
              'El numero de referencia no corresponde con ninguna nota de credito'
            );
        }
        else {
          doc.getSum('for', 'amount');

        }
      }
    },
    {
      fieldname: 'writeoff',
      label: 'Cancelar / reembolsar',
      fieldtype: 'Currency'
    },
    {
      fieldname: 'for',
      label: 'Pago por',
      fieldtype: 'Table',
      childtype: 'PaymentFor',
      required: 1
    }
  ],

  quickEditFields: [
    'party',
    'date',
    'paymentMethod',
    'account',
    'paymentType',
    'paymentAccount',
    'referenceId',
    'referenceDate',
    'clearanceDate',
    'amount',
    'writeoff',
    'for'
  ],

  layout: [
    {
      columns: [
        {
          fields: ['party', 'account']
        },
        {
          fields: ['date', 'paymentAccount']
        }
      ]
    },
    {
      columns: [
        {
          fields: ['paymentMethod']
        },
        {
          fields: ['paymentType']
        },
        {
          fields: ['referenceId']
        }
      ]
    },
    {
      columns: [
        {
          fields: ['referenceDate']
        },
        {
          fields: ['clearanceDate']
        }
      ]
    },
    {
      columns: [
        {
          fields: ['for']
        }
      ]
    },
    {
      columns: [
        {
          fields: ['amount', 'writeoff']
        }
      ]
    }
  ],

  links: [utils.ledgerLink]
};
