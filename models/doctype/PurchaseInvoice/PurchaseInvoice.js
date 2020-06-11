const { getActions } = require('../Transaction/Transaction');
const InvoiceTemplate = require('../SalesInvoice/InvoiceTemplate.vue').default;

module.exports = {
  name: 'PurchaseInvoice',
  doctype: 'DocType',
  label: 'Compra',
  documentClass: require('./PurchaseInvoiceDocument'),
  printTemplate: InvoiceTemplate,
  isSingle: 0,
  isChild: 0,
  isSubmittable: 1,
  keywordFields: ['name', 'supplier'],
  settings: 'PurchaseInvoiceSettings',
  showTitle: true,
  fields: [
    {
      label: 'Número',
      fieldname: 'name',
      fieldtype: 'Data',
      required: 1,
      readOnly: 1
    },
    {
      fieldname: 'date',
      label: 'Fecha',
      fieldtype: 'Date',
      default: new Date().toISOString().slice(0, 10)
    },
    {
      fieldname: 'supplier',
      label: 'Proveedor',
      fieldtype: 'Link',
      target: 'Supplier',
      required: 1
    },
    {
      fieldname: 'account',
      label: 'Cuenta',
      fieldtype: 'Link',
      target: 'Account',
      formula: doc => doc.getFrom('Party', doc.supplier, 'defaultAccount'),
      getFilters: () => {
        return {
          isGroup: 0,
          accountType: 'Payable'
        };
      }
    },
    {
      fieldname: 'currency',
      label: 'Moneda del Proveedor',
      fieldtype: 'Link',
      target: 'Currency',
      hidden: 1,
      formula: doc => doc.getFrom('Party', doc.supplier, 'currency'),
      formulaDependsOn: ['supplier']
    },
    {
      fieldname: 'exchangeRate',
      label: 'Tasa de intercambio',
      fieldtype: 'Float',
      formula: doc => doc.getExchangeRate(),
      required: true
    },
    {
      fieldname: 'items',
      label: 'Productos',
      fieldtype: 'Table',
      childtype: 'PurchaseInvoiceItem',
      required: true
    },
    {
      fieldname: 'netTotal',
      label: 'Total Neto',
      fieldtype: 'Currency',
      formula: doc => doc.getSum('items', 'amount'),
      readOnly: 1,
      getCurrency: doc => doc.currency
    },
    {
      fieldname: 'baseNetTotal',
      label: 'Total Neto (Moneda Local)',
      fieldtype: 'Currency',
      formula: doc => doc.netTotal * doc.exchangeRate,
      readOnly: 1
    },
    {
      fieldname: 'taxes',
      label: 'Impuestos',
      fieldtype: 'Table',
      childtype: 'TaxSummary',
      formula: doc => doc.getTaxSummary(),
      readOnly: 1
    },
    {
      fieldname: 'grandTotal',
      label: 'Total',
      fieldtype: 'Currency',
      formula: doc => doc.getGrandTotal(),
      readOnly: 1,
      getCurrency: doc => doc.currency
    },
    {
      fieldname: 'baseGrandTotal',
      label: 'Total (Moneda Local)',
      fieldtype: 'Currency',
      formula: doc => doc.grandTotal * doc.exchangeRate,
      readOnly: 1
    },
    {
      fieldname: 'outstandingAmount',
      label: 'Monto Pendiente',
      fieldtype: 'Currency',
      formula: doc => {
        if (doc.submitted) return;
        return doc.baseGrandTotal;
      },
      readOnly: 1
    },
    {
      fieldname: 'terms',
      label: 'Términos',
      fieldtype: 'Text'
    },
    {
      fieldname: 'voucherType',
      label: 'Tipo de Comprobante',
      fieldtype: 'Link',
      target: 'VoucherType',
      getFilters: doc => {
        return {
          active: ['in', [1, 'true']],
          useOn: 'Compras'
        };
      },
      disableCreation: true
      //formula: doc => doc.getFrom('VoucherType', doc.name, 'description'),
      // options: [
      //   'Consumidor Final',
      //   'Crédito Fiscal',
      //   'Gubernamental',
      //   'Regimenes Especiales'
      // ],
    },
    {
      fieldname: 'voucherSerie',
      label: 'NCF',
      fieldtype: 'Data'
    }
  ],

  actions: getActions('PurchaseInvoice')
};
