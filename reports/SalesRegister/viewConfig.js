const title = 'Sales Register';
module.exports = {
  title: title,
  method: 'sales-register',
  filterFields: [
    {
      fieldtype: 'Link',
      target: 'Party',
      label: 'Cliente',
      size: 'small',
      placeholder: 'Cliente',
      fieldname: 'customer',
      getFilters: query => {
        if (query)
          return {
            keywords: ['like', query],
            customer: 1
          };

        return {
          customer: 1
        };
      }
    },
    {
      fieldtype: 'Date',
      fieldname: 'fromDate',
      size: 'small',
      placeholder: 'Desde',
      label: 'Desde',
      required: 1
    },
    {
      fieldtype: 'Date',
      size: 'small',
      placeholder: 'Hasta',
      fieldname: 'toDate',
      label: 'Hasta',
      required: 1
    }
  ],
  linkFields: [
    {
      label: 'Limpiar filtros',
      type: 'secondary',
      action: async report => {
        await report.getReportData({});
        report.usedToReRender += 1;
      }
    }
  ],
  getColumns() {
    return [
      { label: 'SalesInvoice', fieldname: 'name' },
      { label: 'Posting Date', fieldname: 'date', fieldtype: 'Date' },
      { label: 'Customer', fieldname: 'customer' },
      { label: 'Receivable Account', fieldname: 'account' },
      { label: 'Net Total', fieldname: 'netTotal', fieldtype: 'Currency' },
      { label: 'Total Tax', fieldname: 'totalTax', fieldtype: 'Currency' },
      { label: 'Grand Total', fieldname: 'grandTotal', fieldtype: 'Currency' }
    ];
  }
};
