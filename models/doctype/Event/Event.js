const { DateTime } = require('luxon');
const EventDocument = require('./EventDocument');

module.exports = {
  name: 'Event',
  doctype: 'DocType',
  naming: 'random',
  documentClass: EventDocument,
  settings: 'EventSettings',
  fields: [
    {
      fieldname: 'title',
      label: 'Título',
      fieldtype: 'Data'
    },
    {
      fieldname: 'date',
      label: 'Fecha',
      fieldtype: 'Date'
    },
    {
      fieldname: 'schedule',
      fieldtype: 'Table',
      childtype: 'EventSchedule',
      label: 'Calendario'
    }
  ],
  titleField: 'title',
  keywordFields: [],
  isSingle: 0,
  listSettings: {
    getFields(list) {
      return ['name', 'title', 'date'];
    },
    getRowHTML(list, data) {
      return `<div class='col-11'>${data.title} on ${data.date}</div>`;
    }
  }
};
