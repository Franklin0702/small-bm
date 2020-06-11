import { _ } from 'frappejs/utils';

export default {
  doctype: 'AccountingLedgerEntry',
  title: _('Contabilidad de Entradas de Libro'),
  columns: ['account', 'party', 'debit', 'credit', 'balance']
};
