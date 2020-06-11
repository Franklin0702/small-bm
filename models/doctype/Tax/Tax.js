module.exports = {
  name: 'Tax',
  label: 'Tax',
  doctype: 'DocType',
  isSingle: 0,
  isChild: 0,
  keywordFields: ['name'],
  fields: [
    {
      fieldname: 'name',
      label: 'Nombre',
      fieldtype: 'Data',
      required: 1
    },
    {
      fieldname: 'details',
      label: 'Detalles',
      fieldtype: 'Table',
      childtype: 'TaxDetail',
      required: 1
    }
  ],
  quickEditFields: ['details']
};
