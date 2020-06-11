module.exports = {
  name: 'Address',
  doctype: 'DocType',
  isSingle: 0,
  keywordFields: [
    'addressLine1',
    'addressLine2',
    'city',
    'state',
    'country',
    'postalCode'
  ],
  fields: [
    {
      fieldname: 'addressLine1',
      label: 'Línea 1',
      placeholder: 'Línea 1',
      fieldtype: 'Data',
      required: 1,
    },
    {
      fieldname: 'addressLine2',
      label: 'Línea 2',
      placeholder: 'Línea 2',
      fieldtype: 'Data'
    },
    {
      fieldname: 'city',
      label: 'Ciudad / Pueblo',
      placeholder: 'Ciudad / Pueblo',
      fieldtype: 'Data',
      required: 1
    },
    {
      fieldname: 'state',
      label: 'Provincia / Estado',
      placeholder: 'Provincia / Estado',
      fieldtype: 'Data'
    },
    {
      fieldname: 'country',
      label: 'País',
      placeholder: 'País',
      fieldtype: 'Data',
      required: 1
    },
    {
      fieldname: 'postalCode',
      label: 'Código Postal',
      placeholder: 'Código Postal',
      fieldtype: 'Data'
    },
    {
      fieldname: 'emailAddress',
      label: 'Dirección de correo',
      placeholder: 'Dirección de correo',
      fieldtype: 'Data'
    },
    {
      fieldname: 'phone',
      label: 'Teléfono',
      placeholder: 'Teléfono',
      fieldtype: 'Data'
    },
    {
      fieldname: 'fax',
      label: 'Fax',
      fieldtype: 'Data'
    },
    {
      fieldname: 'addressDisplay',
      fieldtype: 'Text',
      label: 'Dirección a mostrar',
      readOnly: true,
      formula: doc => {
        return [
          doc.addressLine1,
          doc.addressLine2,
          doc.city,
          doc.state,
          doc.country,
          doc.postalCode
        ]
          .filter(Boolean)
          .join(', ');
      }
    }
  ],
  quickEditFields: [
    'addressLine1',
    'addressLine2',
    'city',
    'state',
    'country',
    'postalCode'
  ],
  inlineEditDisplayField: 'addressDisplay'
};
