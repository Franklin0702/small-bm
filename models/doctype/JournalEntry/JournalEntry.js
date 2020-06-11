const { ledgerLink } = require('../../../accounting/utils');
const { DateTime } = require('luxon');

module.exports = {
  label: 'Entrada de diario',
  name: 'JournalEntry',
  doctype: 'DocType',
  isSubmittable: 1,
  settings: 'JournalEntrySettings',
  fields: [
    {
      fieldname: 'entryType',
      label: 'Tipo de Entrada',
      fieldtype: 'Select',
      placeholder: 'Tipo de Entrada',
      options: [
        'Entrada de Diario',
        'Bank Entry',
        'Cash Entry',
        'Credit Card Entry',
        'Debit Note',
        'Credit Note',
        'Contra Entry',
        'Excise Entry',
        'Write Off Entry',
        'Opening Entry',
        'Depreciation Entry'
      ],
      required: 1
    },
    {
      fieldname: 'date',
      label: 'Fecha',
      fieldtype: 'Date',
      default: DateTime.local().toISODate()
    },
    {
      fieldname: 'accounts',
      label: 'Cuenta de entradas',
      fieldtype: 'Table',
      childtype: 'JournalEntryAccount',
      required: true
    },
    {
      fieldname: 'referenceNumber',
      label: 'Número de referencia',
      fieldtype: 'Data'
    },
    {
      fieldname: 'referenceDate',
      label: 'Fecha de referencia',
      fieldtype: 'Date'
    },
    {
      fieldname: 'userRemark',
      label: 'Comentario del usuario',
      fieldtype: 'Text',
      placeholder: 'Comentario del usuario'
    }
  ],
  actions: [
    {
      label: 'Editar',
      condition: doc => doc.submitted,
      action(doc) {
        doc.revert();
      }
    },
    ledgerLink
  ]
};
