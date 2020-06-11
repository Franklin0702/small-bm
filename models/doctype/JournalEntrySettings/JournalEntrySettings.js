module.exports = {
  name: 'JournalEntrySettings',
  label: 'Configuración de Entrada de Diarío',
  doctype: 'DocType',
  isSingle: 1,
  isChild: 0,
  keywordFields: [],
  fields: [
    {
      fieldname: 'numberSeries',
      label: 'Número de Series',
      fieldtype: 'Link',
      target: 'NumberSeries',
      required: 1,
      default: 'JV'
    }
  ]
};
