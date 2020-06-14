const frappe = require('frappejs');

module.exports = {
  async getPayments() {
    let payments = await frappe.db.getAll({
      doctype: 'PaymentFor',
      fields: ['parent'],
      filters: { referenceName: this.name },
      orderBy: 'name'
    });
    if (payments.length != 0) {
      return payments;
    }
    return [];
  },

  async beforeUpdate() {
    const entries = await this.getPosting();
    await entries.validateEntries();
  },

  async beforeInsert() {
    const entries = await this.getPosting();
    await entries.validateEntries();
  },
  async beforeSubmit() {
    // Generar NCF para notas de crédito...
    console.log('DOCTYPE INSIDE AFTER SUBMIT: ', this.doctype);
    if (this.doctype === 'AdjustSalesInvoice') {
      let nextSerie = await this.getNextVoucherSerie(this.voucherType);
      try {
        let VoucherType = await frappe.getDoc('VoucherType', this.voucherType);
        console.log('Voucher Serie: ', nextSerie);
        VoucherType.set('current', parseInt(nextSerie.slice(3)));
        await VoucherType.update();
        this.set('voucherSerie', nextSerie);
        // this.voucherSerie = nextSerie;
      } catch (error) {
        console.error('Error getting NCF: ', error);
      }
      // await this.update();
    }
  },
  async afterSubmit() {
    const { checkStockWithDialog } = require('@/utils');
    // post ledger entries
    const entries = await this.getPosting();
    await entries.post();

    // update outstanding amounts if it is a Sales or a Purchase, but not a credit note. 
    if (this.doctype !== 'AdjustSalesInvoice') {
      await frappe.db.setValue(
        this.doctype,
        this.name,
        'outstandingAmount',
        this.baseGrandTotal
        );
        let party = await frappe.getDoc('Party', this.customer || this.supplier);
        await party.updateOutstandingAmount();
    }


    if (this.submitted === 1) {
      let Items = this.items;

      for (let l_item of Items) {
        let item = await frappe.getDoc('Item', l_item.item);
        item.set(
          'stock',
          (this.doctype === 'SalesInvoice' ? -1 : 1) * l_item.quantity +
            item.stock
        );
        await item.update();

        console.log(
          '====================== SUBMIT ============================='
        );
        console.log('Factor: ', this.doctype === 'SalesInvoice' ? -1 : 1);
        console.log('Cantidad: ', l_item.quantity);
        console.log('Current Stock: ', item.stock);
        console.log(
          'CALC STOCK: ',
          (this.doctype === 'SalesInvoice' ? -1 : 1) * l_item.quantity +
            item.stock
        );
        console.log(
          '====================== SUBMIT ============================='
        );
      }
      checkStockWithDialog({}, this);
    }
  },

  async afterRevert() {
    let paymentRefList = await this.getPayments();
    for (let paymentFor of paymentRefList) {
      const paymentReference = paymentFor.parent;
      const payment = await frappe.getDoc('Payment', paymentReference);
      const paymentEntries = await payment.getPosting();
      await paymentEntries.postReverse();
      // To set the payment status as unsubmitted.
      payment.revert();
    }

    const entries = await this.getPosting();
    await entries.postReverse();

    if (this.submitted === 0) {
      let Items = this.items;
      let item = {};
      for (let l_item of Items) {
        item = await frappe.getDoc('Item', l_item.item);
        console.log('item before update: ', item);
        item.set(
          'stock',
          (this.doctype === 'SalesInvoice' ? 1 : -1) * l_item.quantity +
            item.stock
        );
        await item.update();
        console.log('item after update: ', item);

        console.log(
          '====================== REVERT ============================='
        );
        console.log('Producto: ', item.name);
        console.log('Factor: ', this.doctype === 'SalesInvoice' ? 1 : -1);
        console.log('Cantidad: ', l_item.quantity);
        console.log('Current Stock: ', item.stock);
        console.log(
          'CALC STOCK: ',
          (this.doctype === 'SalesInvoice' ? 1 : -1) * l_item.quantity +
            item.stock
        );
        console.log(
          '====================== REVERT ============================='
        );
      }
    }
  }
};
