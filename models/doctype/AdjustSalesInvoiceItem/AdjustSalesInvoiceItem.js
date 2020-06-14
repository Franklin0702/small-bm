module.exports = {
    name: 'AdjustSalesInvoiceItem',
    doctype: 'DocType',
    isChild: 1,
    keywordFields: [],
    tableFields: ['item', 'tax', 'quantity', 'rate', 'amount'],
    fields: [
      {
        fieldname: 'item',
        label: 'Producto',
        fieldtype: 'Link',
        target: 'Item',
        required: 1,
        getFilters(_, doc) {
          let items = doc.parentdoc.items.map(d => d.item).filter(Boolean);
          if (items.length > 0) {
            return {
              name: ['not in', items]
            };
          }
        }
      },
      {
        fieldname: 'description',
        label: 'Descripción',
        fieldtype: 'Text',
        formula: (row, doc) => doc.getFrom('Item', row.item, 'description'),
        hidden: 1
      },
      {
        fieldname: 'quantity',
        label: 'Cantidad',
        fieldtype: 'Float',
        required: 1,
        formula: () => 1
      },
      {
        fieldname: 'rate',
        label: 'Precio',
        fieldtype: 'Currency',
        required: 1,
        formula: async (row, doc) => {
          let baseRate = await doc.getFrom('Item', row.item, 'rate');
          return baseRate / doc.exchangeRate;
        },
        getCurrency: (row, doc) => doc.currency
      },
      {
        fieldname: 'baseRate',
        label: 'Precio (Moneda Local)',
        fieldtype: 'Currency',
        formula: (row, doc) => row.rate * doc.exchangeRate,
        readOnly: 1
      },
      {
        fieldname: 'account',
        label: 'Cuenta',
        hidden: 1,
        fieldtype: 'Link',
        target: 'Account',
        required: 1,
        formula: (row, doc) => doc.getFrom('Item', row.item, 'incomeAccount')
      },
      {
        fieldname: 'tax',
        label: 'Impuestos',
        fieldtype: 'Link',
        target: 'Tax',
        formula: (row, doc) => {
          if (row.tax) return row.tax;
          return doc.getFrom('Item', row.item, 'tax');
        }
      },
      {
        fieldname: 'amount',
        label: 'Monto',
        fieldtype: 'Currency',
        readOnly: 1,
        formula: row => row.quantity * row.rate,
        getCurrency: (row, doc) => doc.currency
      },
      {
        fieldname: 'baseAmount',
        label: 'Monto (Moneda Local)',
        fieldtype: 'Currency',
        readOnly: 1,
        formula: (row, doc) => row.amount * doc.exchangeRate
      }, 
      {
          fieldname: 'affectedItem',
          label: 'Producto Afectado',
          fieldtype: 'Data',
          default: ''
      }
    ]
  };
  