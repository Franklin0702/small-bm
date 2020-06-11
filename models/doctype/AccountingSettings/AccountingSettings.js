const countryList = Object.keys(require('~/fixtures/countryInfo.json')).sort();

module.exports = {
  name: 'AccountingSettings',
  label: 'Configuración de Contabilidad',
  naming: 'name', // {random|autoincrement}
  isSingle: 1,
  isChild: 0,
  isSubmittable: 0,
  settings: null,
  keywordFields: [],
  fields: [
    {
      label: 'Nombre del Negocio',
      fieldname: 'companyName',
      fieldtype: 'Data',
      required: 1
    },

    {
      label: 'Cuenta de cancelación',
      fieldname: 'writeOffAccount',
      fieldtype: 'Link',
      target: 'Account',
      default: 'Write Off',
      getFilters() {
        return {
          isGroup: 0,
          rootType: 'Expense'
        };
      }
    },

    {
      label: 'Cuenta de redondeo',
      fieldname: 'roundOffAccount',
      fieldtype: 'Link',
      target: 'Account',
      default: 'Rounded Off',
      getFilters() {
        return {
          isGroup: 0,
          rootType: 'Expense'
        };
      }
    },

    {
      fieldname: 'country',
      label: 'País',
      fieldtype: 'AutoComplete',
      placeholder: 'Elegir País',
      required: 1,
      getList: () => countryList
    },

    {
      fieldname: 'currency',
      label: 'Moneda',
      fieldtype: 'Data',
      required: 0
    },

    {
      fieldname: 'fullname',
      label: 'Nombre',
      fieldtype: 'Data',
      required: 1
    },

    {
      fieldname: 'email',
      label: 'Correo',
      fieldtype: 'Data',
      required: 1,
      validate: {
        type: 'email'
      }
    },

    {
      fieldname: 'bankName',
      label: 'Banco',
      fieldtype: 'Data',
      required: 1
    },

    {
      fieldname: 'fiscalYearStart',
      label: 'Inicio del año fiscal',
      fieldtype: 'Date',
      required: 1
    },

    {
      fieldname: 'fiscalYearEnd',
      label: 'Fin del año fiscal',
      fieldtype: 'Date',
      required: 1
    },

    {
      fieldname: 'setupComplete',
      label: 'Completado',
      fieldtype: 'Check',
      default: 0
    },

    {
      fieldname: 'autoUpdate',
      label: 'Actualizar automáticamente',
      fieldtype: 'Check',
      default: 1
    }
  ],
  quickEditFields: [
    'fullname',
    'email',
    'companyName',
    'country',
    'currency',
    'fiscalYearStart',
    'fiscalYearEnd'
  ]
};
