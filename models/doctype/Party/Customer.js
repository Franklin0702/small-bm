const frappe = require('frappejs');
const { _ } = require('frappejs/utils');
const router = require('@/router').default;
const PartyWidget = require('./PartyWidget.vue').default;

module.exports = {
  name: 'Customer',
  label: 'Cliente',
  basedOn: 'Party',
  filters: {
    customer: 1
  },
  actions: [
    {
      label: _('Registrar Venta'),
      condition: doc => !doc.isNew(),
      action: async customer => {
        let doc = await frappe.getNewDoc('SalesInvoice');
        router.push({
          path: `/edit/SalesInvoice/${doc.name}`,
          query: {
            doctype: 'SalesInvoice',
            values: {
              customer: customer.name
            }
          }
        });
      }
    },
    {
      label: _('Ver Ventas'),
      condition: doc => !doc.isNew(),
      action: customer => {
        router.push({
          name: 'ListView',
          params: {
            doctype: 'SalesInvoice',
            filters: {
              customer: customer.name
            }
          }
        });
      }
    }
  ],
  quickEditWidget: doc => ({
    render(h) {
      return h(PartyWidget, {
        props: { doc }
      });
    }
  })
};
