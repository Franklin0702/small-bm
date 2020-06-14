<template>
  <div v-if="doc">
    <div class="text-gray-600 text-sm mb-1">
      Factura del {{doc.date}}
    </div>
    <div class="px-2 text-base">
      <FormControl
        :df="meta.getField('items')"
        :value="doc.items"
        :showHeader="true"
        :max-rows-before-overflow="4"
        @change="value => doc.set('items', value)"
        :disable="['fields', 'remove', 'credit-note-option', 'addRow', 'label']"
        :read-only="false"
      />
    </div>
  </div>
</template>
<script>
import frappe from 'frappejs';
import FormControl from '@/components/Controls/FormControl';
export default {
  name: 'TargetInvoiceInfo',
  props: ['invoiceName', 'OnTake'],
  components: {
    FormControl
  },
  data() {
    return {
      doc: null,
      doctype: 'SalesInvoice'
    };
  },
  async mounted() {
    try {
      this.doc = await frappe.getDoc('SalesInvoice', this.invoiceName);
    } catch (error) {
      console.error(error);
    }
  },
  computed: {
    meta() {
      return frappe.getMeta(this.doctype);
    }
  }
};
</script>
