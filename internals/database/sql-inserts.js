const sql = require('sql');

const getEntityTable = (tableName) => sql.Table.define({
    name: tableName,
    columns: ['id', 'createdAt', 'updatedAt', 'parentId']
});

const getEntityInsertStatement = (prefix, tableName) => {
    const idAsString = `${prefix}1704010001`;
    const entityTable = getEntityTable(tableName);
    return entityTable.insert(
        entityTable.id.value(+idAsString),
        entityTable.createdAt.value('2017-04-19 17:55:59.605 +00:00'),
        entityTable.updatedAt.value('2017-04-19 17:55:59.605 +00:00')
    ).toQuery();
};

const getChildInsertStatement = (prefix, tableName) => {
    const idAsString = `${prefix}1704010001`;
    const childTable = getEntityTable(tableName);
    return childTable.insert(
        childTable.id.value(+idAsString),
        childTable.parentId.value(1011704010001),
        childTable.createdAt.value('2017-04-19 17:55:59.605 +00:00'),
        childTable.updatedAt.value('2017-04-19 17:55:59.605 +00:00')
    ).toQuery();
};

module.exports = [
    getEntityInsertStatement(101, 'leads'),
    getChildInsertStatement(102, 'changes'),
    getChildInsertStatement(103, 'messages'),
    getChildInsertStatement(104, 'notes'),
];