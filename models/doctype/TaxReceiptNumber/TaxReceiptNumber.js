module.exports = {
    naming: 'autoincrement',
    name: 'TaxReceiptNumber',
    label: 'NCF',
    doctype: 'DocType',
    isSingle: 0,
    isChild: 0,
    keywordFields: ['name'],
    fields: [
        {
            fieldname: 'name',
            fieldtype: 'Data',
            required: true,
            readonly:  true
        },
        {
            fieldname: 'serie',
            fieldtype: 'Data',
            label: 'Serie DGII',
            required: true
        },
        
    ],

};
