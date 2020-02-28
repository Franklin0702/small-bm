const frappe = require('frappejs');
const { _ } = require('frappejs/utils');

module.exports = {
  name: 'Item',
  doctype: 'DocType',
  isSingle: 0,
  keywordFields: ['name', 'description'],
  fields: [
    {
      fieldname: 'name',
      label: 'Nombre del artículo',
      fieldtype: 'Data',
      placeholder: 'Nombre del artículo',
      required: 1
    },
    {
      fieldname: 'image',
      label: 'Imagén',
      fieldtype: 'AttachImage'
    },
    {
      fieldname: 'description',
      label: 'Descripción',
      fieldtype: 'Text'
    },
    {
      fieldname: 'unit',
      label: 'Unidad',
      fieldtype: 'Select',
      default: 'Unit',
      options: ['Libras', '25-Libras', '50-Libras', '100-Libras', 'Unidad']
    },
    {
      fieldname: 'itemType',
      label: 'Tipo',
      placeholder: 'Sales',
      fieldtype: 'Select',
      default: 'Producto',
      options: ['Producto', 'Servicio']
    },
    {
      fieldname: 'incomeAccount',
      label: 'Cuenta de Ingresos',
      fieldtype: 'Link',
      target: 'Account',
      placeholder: 'Sales',
      required: 1,
      disableCreation: true,
      getFilters: () => {
        return {
          isGroup: 0,
          accountType: 'Income Account'
        };
      },
      formulaDependsOn: ['itemType'],
      formula(doc) {
        if (doc.itemType === 'Producto') {
          return 'Sales';
        }
        if (doc.itemType === 'Servicio') {
          return 'Service';
        }
      }
    },
    {
      fieldname: 'expenseAccount',
      label: 'Cuenta de Gastos',
      fieldtype: 'Link',
      target: 'Account',
      placeholder: 'Seleccione un cuenta',
      required: 1,
      disableCreation: true,
      getFilters: () => {
        return {
          isGroup: 0,
          accountType: ['in', ['Cost of Goods Sold', 'Expense Account']]
        };
      },
      formulaDependsOn: ['itemType'],
      formula() {
        return 'Cost of Goods Sold';
      }
    },
    {
      fieldname: 'tax',
      label: 'Impuesto',
      fieldtype: 'Link',
      target: 'Tax',
      placeholder: 'GST'
    },
    {
      fieldname: 'rate',
      label: 'Precio',
      fieldtype: 'Currency',
      placeholder: '0.00',
      validate(value) {
        if (!value) {
          throw new frappe.errors.ValidationError(
            'Precio debe ser mayor que 0'
          );
        }
      }
    },
    {
      fieldname: 'min',
      label: 'Mínimo',
      fieldtype: 'Float',
      placeholder: '0.0',
      validate(value) {
        if (value && value <= 0) {
          throw new frappe.errors.ValidationError(
            'Mínimo debe ser mayor que cero'
          );
        }
      }
    },
    {
      fieldname: 'stock',
      label: 'Inventario',
      fieldtype: 'Float',
      formula: async row => {
        if (row.stock === null) {
          console.log('Calculating stock....');
          const sItems = await frappe.db.getAll({
            doctype: 'SalesInvoiceItem',
            fields: ['quantity', 'item', 'parent'],
            filters: {
              parent: row.name
            },
            orderBy: 'name'
          });

          const pItems = await frappe.db.getAll({
            doctype: 'PurchaseInvoiceItem',
            fields: ['quantity', 'item', 'parent'],
            filters: {
              parent: row.name
            },
            orderBy: 'name'
          });

          let stock_temp = pItems['quantity'] - sItems['quantity'];
          return stock_temp <= 0 ? 0 : stock_temp;
        }
        console.log('STOCK', row.stock);
        return row.stock;
      }
    }
  ],
  quickEditFields: ['rate', 'unit', 'itemType', 'tax', 'min', 'description'],
  actions: [
    {
      label: _('Vender'),
      condition: doc => !doc.isNew(),
      action: async (doc, router) => {
        const invoice = await frappe.getNewDoc('SalesInvoice');
        invoice.append('items', {
          item: doc.name,
          rate: doc.rate,
          tax: doc.tax
        });
        router.push(`/edit/SalesInvoice/${invoice.name}`);
      }
    },
    {
      label: _('Comprar'),
      condition: doc => !doc.isNew(),
      action: async (doc, router) => {
        const invoice = await frappe.getNewDoc('PurchaseInvoice');
        invoice.append('items', {
          item: doc.name,
          rate: doc.rate,
          tax: doc.tax
        });
        router.push(`/edit/PurchaseInvoice/${invoice.name}`);
      }
    }
  ]
};
