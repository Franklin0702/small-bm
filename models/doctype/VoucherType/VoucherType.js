module.exports = {
  name: 'VoucherType',
  label: 'Tipo de Comprobante',
  doctype: 'DocType',
  isSingle: 0,
  keywordFields: ['name', 'useOn', 'active'],
  titleField: 'description',
  tableFields: ['name', 'code'],
  fields: [
    {
      fieldname: 'name',
      label: 'Id',
      fieldtype: 'Data',
      required: 1
    },
    {
      fieldname: 'code',
      label: 'Codigo',
      fieldtype: 'Data'
      //childtype: 'TaxDetail',
    },
    {
      fieldname: 'description',
      label: 'Descripción',
      fieldtype: 'Data',
      default: 'test'
    },
    {
      fieldname: 'initial',
      label: 'Secuencia Inicial',
      fieldtype: 'Int',
      default: 0
    },
    {
      fieldname: 'end',
      label: 'Secuencia Final',
      fieldtype: 'Int',
      default: 0
    },
    {
      fieldname: 'current',
      label: 'Secuencia Actual',
      fieldtype: 'Int',
      default: 0
    },
    {
      fieldname: 'serie',
      label: 'Serie DGII',
      fieldtype: 'Data',
      default: ''
    },
    {
      fieldname: 'active',
      label: 'activo',
      fieldtype: 'Check',
      default: 1
    },
    {
      fieldname: 'useOn',
      label: 'Usar en',
      fieldtype: 'Select',
      options: ['Todos', 'Ventas', 'Compras', 'Ajustes']
    },
    {
      fieldname: 'sequenceLength',
      label: 'Cantidad de Ceros (0)',
      fieldtype: 'Int',
      default: 8
    }
  ],
  quickEditFields: [
    'code',
    'description',
    'initial',
    'end',
    'current',
    'serie',
    'useOn',
    'active',
    'sequenceLength'
  ]
};
