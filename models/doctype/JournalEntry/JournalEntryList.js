import { _ } from 'frappejs/utils';

export default {
  doctype: 'JournalEntry',
  title: _('Entrada de Diario'),
  formRoute: name => `/edit/JournalEntry/${name}`,
  columns: [
    { fieldname: 'date', label: 'Fecha' },
    {
      label: 'ID Entrada',
      fieldname: 'name',
      fieldtype: 'Data',
      getValue(doc) {
        return doc.name;
      }
    },
    { fieldname: 'entryType', label: 'Tipo de Entrada' },
    { fieldname: 'referenceNumber', label: 'Referencia' }
  ]
};
