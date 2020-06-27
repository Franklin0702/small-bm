<script>
import frappe from 'frappejs';
export default {
  name: 'Base',
  props: ['doc', 'printSettings'],
  data: () => ({ party: null, companyAddress: null, VoucherType: null }),
  methods: {
    format(row, fieldname) {
      let value = row.get(fieldname);
      return frappe.format(value, row.meta.getField(fieldname));
    }
  },
  async mounted() {
    await this.doc.loadLink(this.partyField);
    this.party = this.doc.getLink(this.partyField);
    
    await this.doc.loadLink('voucherType')
    this.VoucherType = this.doc.getLink('voucherType');
    
    await this.printSettings.loadLink('address');
    this.companyAddress = this.printSettings.getLink('address');
  },
  computed: {
    partyField() {
      return ['SalesInvoice', 'AdjustSalesInvoice'].includes(this.doc.doctype)  ? 'customer' : 'supplier';
    }
  }
};
</script>
