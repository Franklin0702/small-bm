module.exports = {
  name: 'AccountingLedgerEntry',
  label: 'Entrada de libro mayor',
  naming: 'autoincrement',
  doctype: 'DocType',
  isSingle: 0,
  isChild: 0,
  keywordFields: ['account', 'party', 'referenceName'],
  fields: [
    {
      fieldname: 'date',
      label: 'Fecha',
      fieldtype: 'Date'
    },
    {
      fieldname: 'account',
      label: 'Cuenta',
      fieldtype: 'Link',
      target: 'Account',
      required: 1
    },
    {
      fieldname: 'description',
      label: 'Descripción',
      fieldtype: 'Text'
    },
    {
      fieldname: 'party',
      label: 'Interesado (Cliente / Proveedor)',
      fieldtype: 'Link',
      target: 'Party'
    },
    {
      fieldname: 'debit',
      label: 'Débito',
      fieldtype: 'Currency'
    },
    {
      fieldname: 'credit',
      label: 'Crédito',
      fieldtype: 'Currency'
    },
    {
      fieldname: 'againstAccount',
      label: 'Contra Cuenta',
      fieldtype: 'Text'
    },
    {
      fieldname: 'referenceType',
      label: 'Tipo de referencia',
      fieldtype: 'Data'
    },
    {
      fieldname: 'referenceName',
      label: 'Nombre de referencia',
      fieldtype: 'DynamicLink',
      references: 'referenceType'
    },
    {
      fieldname: 'balance',
      label: 'Balance',
      fieldtype: 'Currency'
    }
  ],
  quickEditFields: [
    'date',
    'account',
    'description',
    'party',
    'debit',
    'credit',
    'againstAccount',
    'referenceType',
    'referenceName',
    'balance'
  ]
};
