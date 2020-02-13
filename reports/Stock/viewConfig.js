const title = 'Inventario';
module.exports = {
  title: title,
  method: 'stock',
  filterFields: [
    {
      fieldtype: 'Link',
      target: 'Item',
      label: 'Producto',
      size: 'small',
      placeholder: 'Producto',
      fieldname: 'item'
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
    },
    {
      fieldtype: 'Select',
      size: 'small',
      options: [
        'Seleccione un periodo',
        'Mensual',
        'Semanal',
        'Seis Meses',
        'Anual'
      ],
      default: 'Mensual',
      label: 'Periodo',
      fieldname: 'periodicity'
    }
  ],
  linkFields: [
    {
      label: 'Limpiar',
      type: 'secondary',
      action: async report => {
        await report.getReportData({});
        report.usedToReRender += 1;
      }
    }
  ],
  getColumns() {
    return [
      { label: 'Producto', fieldname: 'name' },
      { label: 'Unidad', fieldname: 'unit' },
      { label: 'Cantidad Previa', fieldname: 'prevQuantity' },
      { label: 'Compra', fieldname: 'buy' },
      { label: 'Venta', fieldname: 'sell' },
      { label: 'Balance', fieldname: 'balance' }
    ];
  }
};
