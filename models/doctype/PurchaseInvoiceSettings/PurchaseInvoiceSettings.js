module.exports = {
  name: 'PurchaseInvoiceSettings',
  label: 'Configuración de Compra',
  doctype: 'DocType',
  isSingle: 1,
  isChild: 0,
  keywordFields: [],
  fields: [
    {
      fieldname: 'numberSeries',
      label: 'Prefijo',
      fieldtype: 'Link',
      target: 'NumberSeries',
      required: 1,
      default: 'PINV'
    }
  ]
};
