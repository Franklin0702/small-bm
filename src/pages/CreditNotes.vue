<template>
  <div class="flex flex-col" v-if="doc">
    <PageHeader>
      <BackLink slot="title" />
      <template slot="actions">
        <Button
          v-if="doc.submitted"
          class="text-gray-900 text-xs ml-2"
          :icon="true"
          @click="$router.push(`/print/${doc.doctype}/${doc.name}`)"
        >
          Imprimir
        </Button>
        <DropdownWithActions class="ml-2" :actions="actions" />
        <Button
          v-if="showSave"
          type="primary"
          class="text-white text-xs ml-2"
          @click="onSaveClick"
        >
          {{ _('Guardar') }}
        </Button>
        <Button
          v-if="!doc._dirty && !doc._notInserted && !doc.submitted"
          type="primary"
          class="text-white text-xs ml-2"
          @click="onSubmitClick"
          >{{ _('Confirmar') }}</Button
        >
      </template>
    </PageHeader>
    <div class="flex justify-center flex-1 mb-8 mt-2" v-if="meta">
      <div
        class="border rounded-lg shadow h-full flex flex-col justify-between"
        style="width: 600px"
      >
        <div>
          <div class="px-6 pt-6" v-if="printSettings">
            <div class="flex text-sm text-gray-900 border-b pb-4">
              <div class="w-1/3">
                <div v-if="printSettings.displayLogo">
                  <img
                    class="h-12 max-w-32 object-contain"
                    :src="printSettings.logo"
                  />
                </div>
                <div class="text-xl text-gray-700 font-semibold" v-else>
                  {{ companyName }}
                </div>
              </div>
              <div class="w-1/3">
                <div>{{ printSettings.email }}</div>
                <div class="mt-1">{{ printSettings.phone }}</div>
              </div>
              <div class="w-1/3">
                <div v-if="address">{{ address.addressDisplay }}</div>
              </div>
            </div>
          </div>
          <div class="mt-8 px-6">
            <h1 class="text-2xl font-semibold">
              {{ doc._notInserted ? _('Nota de Credito') : doc.name }}
            </h1>
            <div class="flex justify-left mt-2">
              <input
                class="bg-gray-100 p-2 text-lg font-semibold"
                type="text"
                placeholder="NCF..."
                name="buscarNCF"
                id="buscarNCF"
                value=""
                v-model="doc.affectedSerie"
                :readonly="doc.submitted === 1"
              />
              <Button
                type="primary"
                class="text-white text-xs ml-2"
                :disabled="doc.submitted === 1"
                @click="SearchVoucherSerie"
              >
                {{ _('Buscar') }}
              </Button>
            </div>
            <div class="flex justify-between mt-2">
              <div v-if="targetInvoice">
                <div class="flex justify-left border-bottom border-dark">
                  <feather-icon
                    name="eye-off"
                    v-if="showTargetInvoice"
                    class="mr-1 w-3 h-3 text-gray-800 cursor-pointer d-inline-block"
                    @click="showTargetInvoice = false"
                  />
                  <feather-icon
                    name="eye"
                    v-if="!showTargetInvoice"
                    @click="showTargetInvoice = true"
                    class="w-3 h-3 text-blue-800 cursor-pointer d-inline-block"
                  />

                  <span
                    class="text-gray-800 text-xs cursor-pointer d-inline-block"
                    @click="LoadAllRows"
                  >
                    {{ _('Cargar Todos') }}
                  </span>
                </div>
                <TargetInvoiceInfo
                  v-if="showTargetInvoice"
                  :invoiceName="targetInvoice.name"
                  @Take="onTake"
                />
              </div>
            </div>
            <div class="flex justify-between mt-2">
              <div class="w-1/3">
                <FormControl
                  class="text-base"
                  input-class="bg-gray-100 p-2 text-lg font-semibold"
                  :df="meta.getField(partyField.fieldname)"
                  :value="doc[partyField.fieldname]"
                  :placeholder="partyField.label"
                  @change="value => doc.set(partyField.fieldname, value)"
                  @new-doc="party => doc.set(partyField.fieldname, party.name)"
                  :read-only="true"
                />

                <FormControl
                  class="mt-2 text-base"
                  input-class="bg-gray-100 px-3 py-2 text-base"
                  :df="meta.getField('account')"
                  :value="doc.account"
                  :placeholder="'Cuenta Contable'"
                  @change="value => doc.set('account', value)"
                  :read-only="true"
                />
              </div>
              <div class="w-1/3">
                <FormControl
                  class="text-base"
                  input-class="bg-gray-100 px-2 text-base text-right"
                  :df="meta.getField('date')"
                  :value="doc.date"
                  :placeholder="'Fecha'"
                  @change="value => doc.set('date', value)"
                  :read-only="doc.submitted"
                />

                <FormControl
                  class="mt-2 text-base"
                  input-class="bg-gray-100 px-3 py-2 text-base text-right"
                  :df="meta.getField('voucherType')"
                  :value="doc.voucherType"
                  :placeholder="'Tipo de Comprobante'"
                  @change="value => doc.set('voucherType', value)"
                  :read-only="true"
                />

                <FormControl
                  class="mt-2 text-base"
                  input-class="bg-gray-100 px-3 py-2 text-base text-right"
                  :df="meta.getField('voucherSerie')"
                  :value="doc.voucherSerie"
                  :placeholder="'NCF'"
                  @change="value => doc.set('voucherSerie', value)"
                  :read-only="true"
                />
              </div>
            </div>
          </div>
          <div class="px-6 text-base">
            <FormControl
              :df="meta.getField('items')"
              :value="doc.items"
              :showHeader="true"
              :max-rows-before-overflow="4"
              @change="value => doc.set('items', value)"
              :disable="['fields', 'addRow']"
              :read-only="doc.submitted"
            />
          </div>
        </div>
        <div
          class="px-6 mb-6 flex justify-between text-base"
          v-if="doc.items && doc.items.length"
        >
          <div class="flex-1 mr-10">
            <FormControl
              v-if="!doc.submitted || doc.terms"
              :df="meta.getField('terms')"
              :value="doc.terms"
              :show-label="true"
              input-class="bg-gray-100"
              @change="value => doc.set('terms', value)"
              :read-only="doc.submitted"
            />
          </div>
          <div class="w-64">
            <div class="flex pl-2 justify-between py-3 border-b">
              <div>{{ _('Subtotal') }}</div>
              <div>{{ formattedValue('netTotal') }}</div>
            </div>
            <div
              class="flex pl-2 justify-between py-3"
              v-for="tax in doc.taxes"
              :key="tax.name"
            >
              <div>{{ tax.account }} ({{ tax.rate }}%)</div>
              <div>
                {{
                  frappe.format(tax.amount, {
                    fieldtype: 'Currency',
                    currency: doc.currency
                  })
                }}
              </div>
            </div>
            <div
              class="flex pl-2 justify-between py-3 border-t text-green-600 font-semibold text-base"
            >
              <div>{{ _('Total') }}</div>
              <div>{{ formattedValue('grandTotal') }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import frappe from 'frappejs';
import PageHeader from '@/components/PageHeader';
import Button from '@/components/Button';
import FormControl from '@/components/Controls/FormControl';
import DropdownWithActions from '@/components/DropdownWithActions';
import BackLink from '@/components/BackLink';
import TargetInvoiceInfo from '@/pages/TargetInvoiceInfo';
import { openSettings } from '@/utils';
import {
  handleErrorWithDialog,
  checkStockWithDialog,
  getActionsForDocument,
  showMessageDialog
} from '@/utils';

export default {
  name: 'InvoiceForm',
  props: ['doctype', 'name'],
  components: {
    PageHeader,
    Button,
    FormControl,
    DropdownWithActions,
    BackLink,
    TargetInvoiceInfo
  },
  provide() {
    return {
      doctype: this.doctype,
      name: this.name
    };
  },
  data() {
    return {
      doc: null,
      targetInvoice: null,
      printSettings: null,
      companyName: null,
      showTargetInvoice: true
    };
  },
  computed: {
    meta() {
      return frappe.getMeta(this.doctype);
    },
    partyField() {
      let fieldname = {
        SalesInvoice: 'customer',
        AdjustSalesInvoice: 'customer',
        PurchaseInvoice: 'supplier'
      }[this.doctype];
      return this.meta.getField(fieldname);
    },
    address() {
      return this.printSettings && this.printSettings.getLink('address');
    },
    showSave() {
      return this.doc && (this.doc._notInserted || this.doc._dirty);
    },
    actions() {
      return getActionsForDocument(this.doc);
    }
  },
  async mounted() {
    try {
      this.doc = await frappe.getDoc(this.doctype, this.name);
      this.doc.outstandingAmount = 0.0;

      window.d = this.doc;
    } catch (error) {
      if (error instanceof frappe.errors.NotFoundError) {
        this.routeToList();
        return;
      }
      this.handleError(error);
    }
    this.printSettings = await frappe.getSingle('PrintSettings');
    this.companyName = (
      await frappe.getSingle('AccountingSettings')
    ).companyName;

    let query = this.$route.query;
    if (query.values && query.doctype === this.doctype) {
      this.doc.set(this.$router.currentRoute.query.values);
    }
  },
  methods: {
    async SearchVoucherSerie() {
      // let frappe = require('frappejs');
      let checkIfHasBeenUsed = await frappe.db.getAll({
        doctype: 'AdjustSalesInvoice',
        fields: ['name', 'affectedSerie', 'voucherSerie'],
        filters: {
          affectedSerie: this.doc.affectedSerie
        }
      });

      if (checkIfHasBeenUsed.length > 0) {
        let invoice = checkIfHasBeenUsed[0];
        alert(
          `Esta factura fue modificada por la nota de crédito ${invoice.voucherSerie} y no puede ser utilizada`
        );
        // this.doc.set('affectedSerie', '');
      } else {
        let invoicesResult = await frappe.db.getAll({
          doctype: 'SalesInvoice',
          fields: ['name', 'voucherSerie'],
          filters: {
            voucherSerie: this.doc.affectedSerie
          }
        });

        if (invoicesResult.length > 0) {
          this.targetInvoice = invoicesResult[0];
          let invoice = await frappe.getDoc(
            'SalesInvoice',
            this.targetInvoice.name
          );

          this.doc.set('customer', invoice.customer);
          this.doc.set('account', invoice.account);
        } else {
          alert('Esta factura no pudo ser encontrada, favor intente de nuevo.');
        }
      }
    },
    async onTake(val) {
      console.log(this.doc.items);
      try {
        let itemExists =
          (await this.doc.items.filter(i => i.affectedItem === val.name))
            .length > 0;

        if (!itemExists) {
          let newItem = await this.takeInvoiceItem(val);
          this.doc.set('items', [...this.doc.items, newItem]);
          return;
        }

        let item = (
          await this.doc.items.filter(i => i.affectedItem === val.name)
        )[0];
        if (item.quantity < val.quantity) {
          item.set('quantity', item.quantity + 1);
          // this.doc.set('items', [...this.doc.items, newItem]);
        } else {
          alert('Too much items');
        }
      } catch (error) {
        this.handleError(error);
      }
    },

    async takeInvoiceItem(current) {
      let newItem = await this.getNewItemFromInvoiceItem(current);
      newItem.quantity = 1;
      return newItem;
    },
    async getNewItemFromInvoiceItem(current) {
      let newItem = {};
      newItem.affectedItem = current.name;
      newItem.quantity = current.quantity;
      newItem.item = current.item;
      newItem.tax = current.tax;
      return newItem;
    },
    async LoadAllRows() {
      try {
        let newItems = await this.GetNewItemsFromInvoiceItems();
        for (let actualItem of this.doc.items) {
          newItems = [
            ...newItems.filter(
              row => row.affectedItem !== actualItem.affectedItem
            )
          ];
        }
        this.doc.set('items', [...newItems]);
      } catch (error) {
        this.handleError(error);
      }
    },
    async GetNewItemsFromInvoiceItems() {
      let invoice = await frappe.getDoc(
        'SalesInvoice',
        this.targetInvoice.name
      );
      let newItems = [];
      for (let item of invoice.items) {
        let newItem = await this.getNewItemFromInvoiceItem(item);
        newItems.push(newItem);
      }
      return newItems;
    },

    async onSaveClick() {
      // this.doc.items.forEach((val) => {
      //   val.
      // });
      await this.doc.set(
        'items',
        this.doc.items.filter(row => row.item)
      );
      return this.doc.insertOrUpdate().catch(this.handleError);
    },
    onSubmitClick() {
      let message = {
        SalesInvoice: '¿Seguro que desea registrar esta venta?',
        PurchaseInvoice: '¿Seguro que desea registrar esta compra?',
        AdjustSalesInvoice: '¿Seguro que desea registrar esta nota de crédito?'
      }[this.doctype];

      showMessageDialog({
        message,
        buttons: [
          {
            label: this._('Registrar'),
            action: () => {
              this.doc.submit().catch(this.handleError);
            }
          },
          {
            label: this._('Cancelar'),
            action() {}
          }
        ]
      });
    },
    handleError(e) {
      handleErrorWithDialog(e, this.doc);
    },
    checkStock(e) {
      checkStockWithDialog(e, this.doc);
    },
    openInvoiceSettings() {
      openSettings('Invoice');
    },
    routeToList() {
      this.$router.push(`/list/${this.doctype}`);
    },
    formattedValue(fieldname, doc) {
      if (!doc) {
        doc = this.doc;
      }
      let df = doc.meta.getField(fieldname);
      return frappe.format(doc[fieldname], df, doc);
    }
  }
};
</script>
