const { DateTime } = require('luxon');
const countryList = require('~/fixtures/countryInfo.json');

module.exports = {
  name: 'SetupWizard',
  label: 'Guía de Preparación',
  naming: 'name',
  isSingle: 1,
  isChild: 0,
  isSubmittable: 0,
  settings: null,
  keywordFields: [],
  fields: [
    {
      fieldname: 'companyLogo',
      label: 'Logo',
      fieldtype: 'AttachImage'
    },
    {
      fieldname: 'country',
      label: 'País',
      fieldtype: 'AutoComplete',
      placeholder: 'Elegir País',
      required: 1,
      getList: () => Object.keys(countryList).sort()
    },

    {
      fieldname: 'fullname',
      label: 'Tú nombre',
      fieldtype: 'Data',
      placeholder: 'Juan Pérez',
      required: 1
    },

    {
      fieldname: 'email',
      label: 'Correo',
      fieldtype: 'Data',
      placeholder: 'juanperez@gmail.com',
      required: 1,
      validate: {
        type: 'email'
      }
    },

    {
      fieldname: 'companyName',
      label: 'Nombre del Negocio',
      placeholder: 'Nombre del Negocio',
      fieldtype: 'Data',
      required: 1
    },

    {
      fieldname: 'bankName',
      label: 'Banco',
      fieldtype: 'Data',
      placeholder: 'Banco principal',
      required: 1
    },

    {
      fieldname: 'fiscalYearStart',
      label: 'Inicio del Año Fiscal',
      placeholder: 'Inicio del año fiscal',
      fieldtype: 'Date',
      formula: doc => {
        if (!doc.country) return;
        let today = DateTime.local();
        let fyStart = countryList[doc.country].fiscal_year_start;
        return DateTime.fromFormat(fyStart, 'MM-dd')
          .plus({
            year: [1, 2, 3].includes(today.month) ? -1 : 0
          })
          .toISODate();
      },
      required: 1
    },

    {
      fieldname: 'fiscalYearEnd',
      label: 'Fin del Año Fiscal',
      placeholder: 'Fin del año fiscal',
      fieldtype: 'Date',
      formula: doc => {
        if (!doc.country) return;
        let today = DateTime.local();
        let fyEnd = countryList[doc.country].fiscal_year_end;
        return DateTime.fromFormat(fyEnd, 'MM-dd')
          .plus({ year: [1, 2, 3].includes(today.month) ? 0 : 1 })
          .toISODate();
      },
      required: 1
    },
    {
      fieldname: 'currency',
      label: 'Moneda',
      fieldtype: 'Data',
      placeholder: 'DOP',
      formula: doc => {
        if (!doc.country) return;
        return countryList[doc.country].currency;
      },
      required: 1
    },
    {
      fieldname: 'completed',
      label: 'Completado',
      fieldtype: 'Check',
      readonly: 1
    }
  ],
  quickEditFields: [
    'fullname',
    'bankName',
    'country',
    'currency',
    'fiscalYearStart',
    'fiscalYearEnd'
  ]
};
