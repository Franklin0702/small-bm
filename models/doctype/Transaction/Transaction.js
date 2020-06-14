const frappe = require('frappejs');
const utils = require('../../../accounting/utils');
const { openQuickEdit } = require('@/utils');
const Badge = require('@/components/Badge').default;

module.exports = {
  getStatusColumn() {
    return {
      label: 'Estado',
      fieldname: 'status',
      fieldtype: 'Select',
      render(doc) {
        let status = 'pendiente';
        let color = 'orange';
        if (!doc.submitted) {
          status = 'borrador';
          color = 'gray';
        }
        if (doc.submitted === 1 && doc.outstandingAmount === 0.0) {
          status = 'pagado';
          color = 'green';
        }
        if(doc.doctype === "AdjustSalesInvoice" && doc.submitted === 1) {
          status = 'completado';
          color = 'green';
        }
        return {
          template: `<Badge class="text-xs" color="${color}">${status}</Badge>`,
          components: { Badge }
        };
      }
    };
  },
  getActions(doctype) {
    return [
      {
        label: 'Pagar',
        condition: doc => doc.submitted && doc.outstandingAmount > 0 && ['SalesInvoice', 'PurchaseInvoice'].includes(doctype),
        action: async function makePayment(doc) {
          let payment = await frappe.getNewDoc('Payment');
          payment.once('afterInsert', async () => {
            await payment.submit();
          });
          let isSales = doctype === 'SalesInvoice';
          let party = isSales ? doc.customer : doc.supplier;
          let paymentType = isSales ? 'Cobro' : 'Pago';
          let hideAccountField = isSales ? 'account' : 'paymentAccount';
          openQuickEdit({
            doctype: 'Payment',
            name: payment.name,
            hideFields: [
              'party',
              'date',
              hideAccountField,
              'paymentType',
              'for'
            ],
            defaults: {
              party,
              [hideAccountField]: doc.account,
              date: new Date().toISOString().slice(0, 10),
              paymentType,
              for: [
                {
                  referenceType: doc.doctype,
                  referenceName: doc.name,
                  amount: doc.outstandingAmount
                }
              ]
            }
          });
        }
      },
      {
        label: 'Editar',
        condition: doc =>
          (doc.submitted && doc.baseGrandTotal === doc.outstandingAmount) /*|| (doc.submitted && doc.doctype === "AdjustSalesInvoice")*/,
        action(doc) {
          doc.revert();
        }
      },
      {
        label: 'Imprimir',
        condition: doc => doc.submitted,
        action(doc, router) {
          router.push(`/print/${doc.doctype}/${doc.name}`);
        }
      },
      utils.ledgerLink
    ];
  }
};
