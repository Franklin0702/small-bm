const frappe = require('frappejs');

module.exports = {
  name: 'Account',
  label: 'Cuenta',
  doctype: 'DocType',
  documentClass: require('./AccountDocument.js'),
  isSingle: 0,
  isTree: 1,
  keywordFields: ['name', 'rootType', 'accountType', 'isGroup'],
  fields: [
    {
      fieldname: 'name',
      label: 'Nombre de Cuenta',
      fieldtype: 'Data',
      required: 1
    },
    {
      fieldname: 'rootType',
      label: 'Tipo Raíz',
      fieldtype: 'Select',
      options: ['', 'Asset', 'Liability', 'Equity', 'Income', 'Expense'],
      required: 1
    },
    {
      fieldname: 'parentAccount',
      label: 'Cuenta Padre',
      fieldtype: 'Link',
      target: 'Account',
      getFilters: (query, doc) => {
        const filter = {
          isGroup: 1
        };
        doc.rootType ? (filter.rootType = doc.rootType) : '';
        return filter;
      }
    },
    {
      fieldname: 'accountType',
      label: 'Tipo de cuenta',
      fieldtype: 'Select',
      options: [
        '',
        'Accumulated Depreciation',
        'Bank',
        'Cash',
        'Chargeable',
        'Cost of Goods Sold',
        'Depreciation',
        'Equity',
        'Expense Account',
        'Expenses Included In Valuation',
        'Fixed Asset',
        'Income Account',
        'Payable',
        'Receivable',
        'Round Off',
        'Stock',
        'Stock Adjustment',
        'Stock Received But Not Billed',
        'Tax',
        'Temporary'
      ]
    },
    {
      fieldname: 'balance',
      label: 'Balance',
      fieldtype: 'Currency',
      default: '0',
      readOnly: 1
    },
    {
      fieldname: 'isGroup',
      label: 'Es un grupo?',
      fieldtype: 'Check'
    }
  ],

  quickEditFields: [
    'name',
    'rootType',
    'parentAccount',
    'accountType',
    'isGroup'
  ],

  treeSettings: {
    parentField: 'parentAccount',
    async getRootLabel() {
      let accountingSettings = await frappe.getSingle('AccountingSettings');
      return accountingSettings.companyName;
    }
  }
};
