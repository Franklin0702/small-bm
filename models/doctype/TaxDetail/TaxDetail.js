module.exports = {
  name: 'TaxDetail',
  label: 'Detalle de Impuesto',
  doctype: 'DocType',
  isSingle: 0,
  isChild: 1,
  keywordFields: [],
  fields: [
    {
      fieldname: 'account',
      label: 'Cuenta de impuesto',
      fieldtype: 'Link',
      target: 'Account',
      required: 1
    },
    {
      fieldname: 'rate',
      label: 'Tasa',
      fieldtype: 'Float',
      required: 1,
      placeholder: '0%'
    }
  ],
  tableFields: [
    'account',
    'rate'
  ]
};
