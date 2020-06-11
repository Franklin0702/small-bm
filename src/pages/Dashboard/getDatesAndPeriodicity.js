import frappe from 'frappejs';
import { DateTime } from 'luxon';

export async function getDatesAndPeriodicity(period) {
  let fromDate, toDate;
  let periodicity = 'Monthly';
  let accountingSettings = await frappe.getSingle('AccountingSettings');

  if (period === 'Este Año') {
    fromDate = accountingSettings.fiscalYearStart;
    toDate = accountingSettings.fiscalYearEnd;
  } else if (period === 'Este Cuatrimestre') {
    fromDate = DateTime.local()
      .startOf('quarter')
      .toISODate();
    toDate = DateTime.local()
      .endOf('quarter')
      .toISODate();
  } else if (period === 'Este Mes') {
    fromDate = DateTime.local()
      .startOf('month')
      .toISODate();
    toDate = DateTime.local()
      .endOf('month')
      .toISODate();
  }

  return {
    fromDate,
    toDate,
    periodicity
  };
}
