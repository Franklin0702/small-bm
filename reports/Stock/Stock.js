const frappe = require('frappejs');
//const Badge = require('@/components/Badge').default;

class Stock {
  async run({ fromDate, toDate, item, periodicity }) {
    //if (/*!fromDate && !toDate && !item*/ false) return { rows: [] };

    let filters = {};

    if (periodicity) {
      let periodicityMap = {
        Mensual: 30,
        Semanal: 7,
        Anual: 365,
        'Seis Meses': 183
      };
      if (periodicityMap[periodicity])
        filters.periodicity = periodicityMap[periodicity];
      else filters.periodicity = 0;
    }

    if (item) {
      filters.item = item;
    }

    if (fromDate && toDate) {
      filters.date = ['>=', fromDate, '<=', toDate];
    } else if (fromDate) {
      if (filters.periodicity != 0) {
        toDate = fromDate + filters.periodicity;
        filters.date = ['>=', fromDate, '<=', toDate];
      }
      filters.date = ['>=', fromDate];
    } else if (toDate) {
      if (filters.periodicity != 0) {
        fromDate = toDate - filters.periodicity;
        filters.date = ['>=', fromDate, '<=', toDate];
      }
      filters.date = ['<=', toDate];
    } else {
      let today = new Date();
      fromDate = new Date(today.getFullYear(), today.getMonth(), 1);
      toDate = fromDate + 30;
      filters.date = ['>=', fromDate, '<=', toDate];
    }

    filters.submitted = 1;

    const invoices = await frappe.db.getAll({
      doctype: 'SalesInvoice',
      fields: ['name', 'date', 'customer', 'account', 'netTotal', 'grandTotal'],
      filters: {
        date: filters.date,
        submitted: filters.submitted
      },
      orderBy: 'date',
      order: 'desc'
    });

    const invoiceNames = invoices.map(d => d.name);

    const saleItems = await frappe.db.getAll({
      doctype: 'SalesInvoiceItem',
      fields: ['quantity', 'item', 'parent'],
      filters: {
        parenttype: 'SalesInvoice',
        parent: ['in', invoiceNames]
      },
      orderBy: 'name'
    });

    const purchases = await frappe.db.getAll({
      doctype: 'PurchaseInvoice',
      fields: ['name', 'date', 'supplier', 'account', 'netTotal', 'grandTotal'],
      filters: {
        date: filters.date,
        submitted: filters.submitted
      },
      orderBy: 'date',
      order: 'desc'
    });

    const purchaseNames = purchases.map(d => d.name);

    const purchaseItems = await frappe.db.getAll({
      doctype: 'PurchaseInvoiceItem',
      fields: ['quantity', 'item', 'parent'],
      filters: {
        parenttype: 'PurchaseInvoice',
        parent: ['in', purchaseNames]
      },
      orderBy: 'name'
    });

    const items = await frappe.db.getAll({
      doctype: 'Item',
      fields: ['name', 'unit', 'min']
    });

    const taxes = await frappe.db.getAll({
      doctype: 'TaxSummary',
      fields: ['parent', 'amount'],
      filters: {
        parenttype: 'Invoice',
        parent: ['in', invoiceNames]
      },
      orderBy: 'name'
    });

    for (let invoice of invoices) {
      invoice.totalTax = taxes
        .filter(tax => tax.parent === invoice.name)
        .reduce((acc, tax) => {
          if (tax.amount) {
            acc = acc + tax.amount;
          }
          return acc;
        }, 0);
    }

    const salesItemsPrev = await frappe.db.getAll({
      doctype: 'SalesInvoiceItem',
      fields: ['name', 'item', 'quantity', 'parent'],
      filters: {
        parenttype: 'SalesInvoice',
        parent: ['not in', invoiceNames]
      },
      orderBy: 'name'
    });
    const purchaseItemsPrev = await frappe.db.getAll({
      doctype: 'PurchaseInvoiceItem',
      fields: ['name', 'item', 'quantity', 'parent'],
      filters: {
        parenttype: 'PurchaseInvoice',
        parent: ['not in', purchaseNames]
      },
      orderBy: 'name'
    });

    let reports = [];
    for (let item of items) {
      console.log('item\n', item);
      let report = {};
      //Calcular la cantidad anterior
      let prevBuy = purchaseItemsPrev
        .filter(p => p.item === item.name)
        .reduce((acc, p) => {
          acc = acc + p.quantity;
          return acc;
        }, 0);
      let prevSell = salesItemsPrev
        .filter(p => p.item === item.name)
        .reduce((acc, p) => {
          acc = acc + p.quantity;
          return acc;
        }, 0);

      report.name = item.name;
      report.unit = item.unit;
      report.prevQuantity = prevBuy - prevSell;

      report.buy = purchaseItems
        .filter(p => p.item === item.name)
        .reduce((acc, p) => {
          acc = acc + p.quantity;
          return acc;
        }, 0);

      report.sell = saleItems
        .filter(s => s.item === item.name)
        .reduce((acc, s) => {
          acc = acc + s.quantity;
          return acc;
        }, 0);

      let balance = report.buy + report.prevQuantity - report.sell;
      let color = 'green';
      if (item.min > balance){
        color = 'red';
      }
      else if (item.min == balance) {
        color = 'orange';
      }

      report.balance = {
            template: `<span style='color:${color};'>${balance}</span>`,
          }
      
      
        

      reports.push(report);
    }
    return { rows: reports };
  }
}

module.exports = Stock;
