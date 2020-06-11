module.exports = {
  name: 'Currency',
  label: 'Moneda',
  doctype: 'DocType',
  isSingle: 0,
  keywordFields: ['name', 'symbol'],
  quickEditFields: ['name', 'symbol'],
  fields: [
    {
      fieldname: 'name',
      label: 'Nombre de moneda',
      fieldtype: 'Data',
      required: 1
    },
    {
      fieldname: 'fraction',
      label: 'Facción',
      fieldtype: 'Data'
    },
    {
      fieldname: 'fractionUnits',
      label: 'Unidades de Fracción',
      fieldtype: 'Int'
    },
    {
      label: 'Valor de fracción de moneda más pequeño',
      fieldname: 'smallestValue',
      fieldtype: 'Currency'
    },
    {
      label: 'Símbolo',
      fieldname: 'symbol',
      fieldtype: 'Data'
    },
    {
      fieldname: 'numberFormat',
      fieldtype: 'Select',
      label: 'Formato de número',
      options: [
        '',
        '#,###.##',
        '#.###,##',
        '# ###.##',
        '# ###,##',
        "#'###.##",
        '#, ###.##',
        '#,##,###.##',
        '#,###.###',
        '#.###',
        '#,###'
      ]
    }
  ]
};
