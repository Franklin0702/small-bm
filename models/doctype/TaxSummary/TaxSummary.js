module.exports = {
  name: 'TaxSummary',
  doctype: 'DocType',
  isChild: 1,
  fields: [
    {
      fieldname: 'account',
      label: 'Cuenta de Impuestos',
      fieldtype: 'Link',
      target: 'Account',
      required: 1
    },
    {
      fieldname: 'rate',
      label: 'Tasa',
      fieldtype: 'Float',
      required: 1
    },
    {
      fieldname: 'amount',
      label: 'Monto',
      fieldtype: 'Currency',
      required: 1
    },
    {
      fieldname: 'baseAmount',
      label: 'Monto (Moneda de la compañía)',
      fieldtype: 'Currency',
      formula: (row, doc) => row.amount * doc.exchangeRate,
      readOnly: 1
    }
  ]
};
