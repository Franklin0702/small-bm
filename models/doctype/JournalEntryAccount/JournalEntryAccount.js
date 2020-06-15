module.exports = {
  name: 'JournalEntryAccount',
  isChild: 1,
  fields: [
    {
      fieldname: 'account',
      label: 'Cuenta',
      placeholder: 'Cuenta',
      fieldtype: 'Link',
      target: 'Account',
      required: 1,
      groupBy: 'rootType',
      getFilters: () => ({ isGroup: 0 })
    },
    {
      fieldname: 'debit',
      label: 'Débito',
      fieldtype: 'Currency',
      formula: autoDebitCredit('debit')
    },
    {
      fieldname: 'credit',
      label: 'Crédito',
      fieldtype: 'Currency',
      formula: autoDebitCredit('credit')
    }
  ],
  tableFields: ['account', 'debit', 'credit']
};

function autoDebitCredit(type = 'debit') {
  let otherType = type === 'debit' ? 'credit' : 'debit';
  return (row, doc) => {
    if (row[type] == 0) return null;
    if (row[otherType]) return null;

    let totalType = doc.getSum('accounts', type);
    let totalOtherType = doc.getSum('accounts', otherType);
    if (totalType < totalOtherType) {
      return totalOtherType - totalType;
    }
  };
}
