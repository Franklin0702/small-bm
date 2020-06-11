const model = require('frappejs/model');
const PurchaseOrder = require('../PurchaseOrder/PurchaseOrder');

module.exports = model.extend(PurchaseOrder, {
    name: "PurchaseReceipt",
    label: "Recibo de Compra",
    settings: "PurchaseReceiptSettings",
    fields: [
        {
            "fieldname": "items",
            "childtype": "PurchaseReceiptItem"
        }
    ]
});
