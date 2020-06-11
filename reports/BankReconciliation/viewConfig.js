const title = 'Bank Reconciliation';
module.exports = {
  title: title,
  method: 'bank-reconciliation',
  filterFields: [
    {
      fieldtype: 'Link',
      target: 'Account',
      size: 'small',
      placeholder: 'Cuenta de Pago',
      label: 'Cuenta de Pago',
      fieldname: 'paymentAccount',
      getFilters: () => {
        return {
          accountType: 'Bank',
          isGroup: 0
        };
      }
    },
    {
      fieldtype: 'Link',
      target: 'Party',
      size: 'small',
      label: 'Interesado (Cliente / Proveedor)',
      placeholder: 'Interesado (Cliente / Proveedor)',
      fieldname: 'party'
    },
    {
      fieldtype: 'Date',
      size: 'small',
      placeholder: 'Desde',
      label: 'Desde',
      fieldname: 'fromDate'
    },
    {
      fieldtype: 'Date',
      size: 'small',
      placeholder: 'Hasta',
      label: 'Hasta',
      fieldname: 'toDate'
    }
  ],
  linkFields: [
    {
      label: 'Interesado (Cliente / Proveedor)',
      type: 'secondary',
      condition: report => report.currentFilters.paymentAccount,
      action: async report => {
        report.$modal.show({
          modalProps: {
            title: `Importar estado de cuenta`,
            noFooter: true
          },
          component: require('../../src/components/ImportWizard').default,
          props: {
            importHandler: require('./BankReconciliationImport')
              .fileImportHandler,
            report
          }
        });
      }
    },
    {
      label: 'Limpiar Filtros',
      type: 'secondary',
      action: async report => {
        await report.getReportData({});
        report.usedToReRender += 1;
      }
    }
  ],
  getColumns() {
    return [
      {
        label: 'Fecha de publicación',
        fieldtype: 'Date',
        fieldname: 'date'
      },
      {
        label: 'Cuenta de Pago',
        fieldtype: 'Link'
      },
      {
        label: 'Débito',
        fieldtype: 'Currency'
      },
      {
        label: 'Crédito',
        fieldtype: 'Currency'
      },
      {
        label: 'Balance',
        fieldtype: 'Currency'
      },
      {
        label: 'Ref / Cheque ID',
        fieldtype: 'Data',
        fieldname: 'referenceId'
      },
      {
        label: 'Fecha de liquidación',
        fieldtype: 'Date',
        fieldname: 'clearanceDate'
      },
      {
        label: 'Tipo de referencia',
        fieldtype: 'Data',
        fieldname: 'referenceType'
      },
      {
        label: 'Nombre de referencia',
        fieldtype: 'Data',
        fieldname: 'referenceName'
      },
      {
        label: 'Fecha de referencia',
        fieldtype: 'Date',
        fieldname: 'referenceDate'
      },

      {
        label: 'Interesados (Cliente / Proveedores)',
        fieldtype: 'Link'
      }
    ];
  }
};
