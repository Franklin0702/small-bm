module.exports = {
  ledgerLink: {
    label: 'Entradas de Libro',
    condition: doc => doc.submitted,
    action: (doc, router) => {
      router.push({
        name: 'Report',
        params: {
          reportName: 'general-ledger',
          defaultFilters: {
            referenceType: doc.doctype,
            referenceName: doc.name
          }
        }
      });
    }
  }
};
