import frappe from 'frappejs';
import { openSettings } from '@/utils';
import { _ } from 'frappejs/utils';
import Icon from './components/Icon';
import router from './router';

const config = {
  getTitle: async () => {
    const { companyName } = await frappe.getSingle('AccountingSettings');
    return companyName;
  },
  groups: [
    {
      title: _('Iniciar'),
      route: '/get-started',
      icon: getIcon('general', '24', '5')
    },
    {
      title: _('Resumen'),
      route: '/',
      icon: getIcon('dashboard')
    },
    {
      title: _('Ventas'),
      icon: getIcon('sales'),
      action() {
        router.push('/list/SalesInvoice');
      },
      items: [
        {
          label: _('Facturas'),
          route: '/list/SalesInvoice',
          doctype: 'SalesInvoice'
        },
        {
          label: _('Clientes'),
          route: '/list/Customer',
          doctype: 'Customer'
        },
        {
          label: _('Productos'),
          route: '/list/Item',
          doctype: 'Item'
        },
        {
          label: _('Notas de crédito'),
          route: '/list/AdjustSalesInvoice',
          doctype: 'AdjustSalesInvoice'
        },
        {
          label: _('Pagos'),
          route: '/list/Payment',
          doctype: 'Payment'
        },
        {
          label: _('Entrada de diario'),
          route: '/list/JournalEntry',
          doctype: 'JournalEntry'
        }
      ]
    },
    {
      title: _('Compras'),
      icon: getIcon('purchase'),
      action() {
        router.push('/list/PurchaseInvoice');
      },
      items: [
        {
          label: _('Facturas'),
          route: '/list/PurchaseInvoice',
          doctype: 'PurchaseInvoice'
        },
        {
          label: _('Proveedores'),
          route: '/list/Supplier',
          doctype: 'Supplier'
        },
        {
          label: _('Productos'),
          route: '/list/Item',
          doctype: 'Item'
        },
        {
          label: _('Pagos'),
          route: '/list/Payment',
          doctype: 'Payment'
        },
        {
          label: _('Entrada de diario'),
          label: _('Journal Entry'),
          route: '/list/JournalEntry',
          doctype: 'JournalEntry'
        }
      ]
    },

    {
      title: _('Reportes'),
      icon: getIcon('reports'),
      action() {
        router.push('/report/stock');
      },
      items: [
        {
          label: _('Inventario'),
          route: '/report/stock'
        },
        {
          label: _('Libro Mayor'),
          route: '/report/general-ledger'
        },
        {
          label: _('Ganancias y Pérdidas'),
          route: '/report/profit-and-loss'
        },
        {
          label: _('Hoja de balance'),
          route: '/report/balance-sheet'
        },
        {
          label: _('Balanza de comprobación'),
          route: '/report/trial-balance'
        }
      ]
    },
    {
      title: _('Configurar'),
      icon: getIcon('settings'),
      items: [
        {
          label: _('Jerarquía de cuentas'),
          route: '/chart-of-accounts'
        },
        {
          label: _('Impuestos'),
          route: '/list/Tax',
          doctype: 'Tax'
        },
        {
          label: _('Comprobantes Fiscales'),
          route: '/list/VoucherType',
          doctype: 'VoucherType'
        },
        {
          label: _('General'),
          action() {
            openSettings();
          }
        }
      ]
    }
  ]
};

function getIcon(name, size = '18', height = null) {
  return {
    name,
    render(h) {
      return h(Icon, {
        props: Object.assign(
          {
            name,
            size,
            height
          },
          this.$attrs
        )
      });
    }
  };
}

export default config;
