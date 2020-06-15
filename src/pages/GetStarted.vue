<template>
  <div class="flex flex-col overflow-y-hidden">
    <PageHeader>
      <h1 slot="title" class="text-2xl font-bold">
        {{ _('Configuralo para tú negocio!') }}
      </h1>
    </PageHeader>
    <div class="px-8">
      <div class="border-t"></div>
    </div>
    <div class="flex-1 px-8 overflow-y-auto">
      <div class="my-6" v-for="section in sections" :key="section.label">
        <h2 class="font-medium">{{ section.label }}</h2>
        <div class="flex mt-4 -mx-2">
          <div
            class="flex-shrink-0 w-full px-2 md:w-1/3 sm:w-1/2"
            v-for="item in section.items"
            :key="item.label"
          >
            <div
              class="flex flex-col justify-between h-full p-6 border rounded-lg cursor-pointer hover:shadow-md"
              @mouseenter="() => (activeCard = item.key)"
              @mouseleave="() => (activeCard = null)"
            >
              <div>
                <component
                  v-show="activeCard !== item.key && !isCompleted(item)"
                  :is="getIconComponent(item)"
                  class="mb-4"
                />
                <Icon
                  v-show="isCompleted(item)"
                  name="green-check"
                  size="24"
                  class="w-5 h-5 mb-4"
                />
                <h3 class="font-medium">{{ item.label }}</h3>
                <p class="mt-2 text-sm text-gray-800">
                  {{ item.description }}
                </p>
              </div>
              <div
                class="flex mt-2 overflow-hidden"
                v-show="activeCard === item.key && !isCompleted(item)"
              >
                <Button
                  v-if="item.action"
                  class="leading-tight"
                  type="primary"
                  v-on="
                    item.action
                      ? {
                          click: () => {
                            item.action();
                            activeCard = null;
                          }
                        }
                      : null
                  "
                >
                  <span class="text-base text-white">
                    {{ item.actionLabel || _('Preparar') }}
                  </span>
                </Button>
                <Button
                  v-if="item.documentation"
                  class="leading-tight"
                  :class="{ 'ml-4': item.action }"
                  @click="visitLink(item.documentation)"
                >
                  <span class="text-base">
                    {{ _('Documentación') }}
                  </span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import frappe from 'frappejs';
import { _ } from 'frappejs/utils';
import PageHeader from '@/components/PageHeader';
import Icon from '@/components/Icon';
import Button from '@/components/Button';
import { openSettings } from '@/utils';

export default {
  name: 'GetStarted',
  components: {
    PageHeader,
    Button,
    Icon
  },
  computed: {
    sections() {
      /* eslint-disable vue/no-side-effects-in-computed-properties */
      return [
        {
          label: _('Tú Negocio'),

          items: [
            {
              key: 'General',
              label: _('General'),
              icon: 'general',
              description:
                'Configura la información de tu compañía, el correo, país y año fiscal.',
              fieldname: 'companySetup'
            },
            {
              key: 'System',
              label: _('Sistema'),
              icon: 'general',
              description:
                'Configura información del sistema como el formato de fechas y la precisión de los valores monetarios.',
              fieldname: 'systemSetup',
              action() {
                openSettings('System');
              }
            },
            {
              key: 'Invoice',
              label: _('Factura (Venta o Compra)'),
              icon: 'invoice',
              description: 'Personaliza tu factura, agrega un logo o dirección',
              fieldname: 'invoiceSetup',
              action() {
                openSettings('Invoice');
              }
            }
          ]
        },
        {
          label: _('Cuentas'),

          items: [
            {
              key: 'Review Accounts',
              label: _('Revisa las cuentas'),
              icon: 'review-ac',
              description:
                'Revisa los gráficos de cuenta, agrega tus propias cuentas o impuestos.',
              action: () => {
                this.$router.push('/chart-of-accounts');
                this.updateChecks({ chartOfAccountsReviewed: 1 });
              },
              fieldname: 'chartOfAccountsReviewed',
              documentation:
                'https://frappebooks.com/docs/setting-up#1-enter-bank-accounts'
            },
            {
              key: 'Opening Balances',
              label: _('Balances Pendientes'),
              icon: 'opening-ac',
              description:
                'Configura tus balances pendientes antes de empezar a trabajar.',
              documentation:
                'https://frappebooks.com/docs/setting-up#5-setup-opening-balances'
            },
            {
              key: 'Taxes',
              label: _('Agrega impuestos'),
              icon: 'percentage',
              description:
                'Configura tus plantillas de impuestos.',
              action: () => this.$router.push('/list/Tax'),
              documentation:
                'https://frappebooks.com/docs/setting-up#2-add-taxes'
            }
          ]
        },
        {
          label: _('Ventas'),

          items: [
            {
              key: 'Add Sales Items',
              label: _('Crea tus productos o servicios'),
              icon: 'item',
              description:
                'Agrega los productos o servicios que le vendes a tus clientes.',
              action: () => this.$router.push('/list/Item'),
              fieldname: 'itemCreated',
              documentation:
                'https://frappebooks.com/docs/setting-up#3-add-items'
            },
            {
              key: 'Customers',
              label: _('Crea Clientes'),
              icon: 'customer',
              description:
                'Crea algunos clientes para comenzar a hacer facturas.',
              action: () => this.$router.push('/list/Customer'),
              fieldname: 'customerCreated',
              documentation:
                'https://frappebooks.com/docs/setting-up#4-add-customers'
            },
            {
              key: 'Invoices',
              label: _('Realiza una venta'),
              icon: 'sales-invoice',
              description: 'Crea tu primera factura y envíasela a tu cliente!',
              action: () => this.$router.push('/list/SalesInvoice'),
              fieldname: 'invoiceCreated',
              documentation: 'https://frappebooks.com/docs/invoices'
            }
          ]
        },
        {
          label: _('Compras'),

          items: [
            {
              key: 'Add Purchase Items',
              label: _('Empieza tu inventario'),
              icon: 'item',
              description:
                'Add products or services that you buy from your suppliers',
              action: () => this.$router.push('/list/Item'),
              fieldname: 'itemCreated'
            },
            {
              key: 'Add Suppliers',
              label: _('Crea Suplidores'),
              icon: 'supplier',
              description:
                'Agrega algunos suplidores y registra tu primera compra!',
              action: () => this.$router.push('/list/Supplier'),
              fieldname: 'supplierCreated'
            },
            {
              key: 'Create Bill',
              label: _('Realiza una compra'),
              icon: 'purchase-invoice',
              description: 'Crea tu primera compra!',
              action: () => this.$router.push('/list/PurchaseInvoice'),
              fieldname: 'billCreated',
              documentation: 'https://frappebooks.com/docs/bills'
            }
          ]
        }
      ];
    }
  },
  data() {
    return {
      activeCard: null
    };
  },
  async activated() {
    frappe.GetStarted = await frappe.getSingle('GetStarted');
    this.checkForCompletedTasks();
  },
  methods: {
    async checkForCompletedTasks() {
      let toUpdate = {};
      if (frappe.GetStarted.onboardingCompleted) {
        return;
      }

      let printSettings = await frappe.getSingle('PrintSettings');
      if (printSettings.logo && printSettings.address) {
        toUpdate.invoiceSetup = 1;
      }

      if (!frappe.GetStarted.itemCreated) {
        let { count } = (
          await frappe.db.knex('Item').count('name as count')
        )[0];
        if (count > 0) {
          toUpdate.itemCreated = 1;
        }
      }

      if (!frappe.GetStarted.invoiceCreated) {
        let { count } = (
          await frappe.db.knex('SalesInvoice').count('name as count')
        )[0];
        if (count > 0) {
          toUpdate.invoiceCreated = 1;
        }
      }

      if (!frappe.GetStarted.customerCreated) {
        let { count } = (
          await frappe.db
            .knex('Party')
            .where('customer', 1)
            .count('name as count')
        )[0];
        if (count > 0) {
          toUpdate.customerCreated = 1;
        }
      }

      if (!frappe.GetStarted.billCreated) {
        let { count } = (
          await frappe.db.knex('PurchaseInvoice').count('name as count')
        )[0];
        if (count > 0) {
          toUpdate.billCreated = 1;
        }
      }

      if (!frappe.GetStarted.supplierCreated) {
        let { count } = (
          await frappe.db
            .knex('Party')
            .where('supplier', 1)
            .count('name as count')
        )[0];
        if (count > 0) {
          toUpdate.supplierCreated = 1;
        }
      }
      await this.updateChecks(toUpdate);
    },
    async updateChecks(toUpdate) {
      await frappe.GetStarted.update(toUpdate);
      frappe.GetStarted = await frappe.getSingle('GetStarted');
    },
    visitLink(link) {
      if (link) {
        require('electron').shell.openExternal(link);
      }
    },
    isCompleted(item) {
      return frappe.GetStarted.get(item.fieldname) || 0;
    },
    getIconComponent(item) {
      let completed = frappe.GetStarted[item.fieldname] || 0;
      let name = completed ? 'green-check' : item.icon;
      let size = completed ? '24' : '18';
      return {
        name,
        render(h) {
          return h(Icon, {
            props: Object.assign(
              {
                name,
                size
              },
              this.$attrs
            )
          });
        }
      };
    }
  }
};
</script>
