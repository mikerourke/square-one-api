/* @flow */

declare type sequelize$RetryOptions = {
    match: Array<string>,
    max: number,
};

declare type sequelize$PoolOptions = {
    maxConnections?: number,
    minConnections?: number,
    maxIdleTime?: number,
    validateConnection?: () => void,
};

declare type sequelize$Options = {
    dialect?: 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql',
    dialectModulePath?: ?string,
    dialectOptions?: Object,
    storage?: string,
    host?: string,
    port?: number,
    protocol?: string,
    define?: Object,
    query?: Object,
    set?: Object,
    sync?: Object,
    timezone?: string,
    logging?: boolean | () => void,
    omitNull?: boolean,
    native?: boolean,
    replication?: boolean,
    pool?: sequelize$PoolOptions,
    quoteIdentifiers?: boolean,
    transactionType?: string,
    isolationLevel?: string,
    retry?: sequelize$RetryOptions,
    typeValidation?: boolean,
    benchmark?: boolean,
};

declare class sequelize$Sequelize {
    constructor(uri: string, options?: sequelize$Options): void;
    models: Object;
    version: number;
    Promise: Object,
    QueryTypes: Object,
    Validator: Object,
    Transaction: Object,
    Deferrable: Object,
    Instance: Object,
    Association: Object,
}

declare type sequelize$DropOptions = {
    logging?: boolean | () => void,
    benchmark?: boolean,
    cascade?: boolean,
};

declare type sequelize$SchemaOptions = {
    logging?: boolean | () => void,
    benchmark?: boolean,
    schemaDelimiter?: string,
};

declare type sequelize$ModelOptions = {
    logging?: boolean | () => void,
    benchmark?: boolean,
};

declare type sequelize$ScopeOptions = {
    override?: boolean,
};

declare type sequelize$Scope = Object | () => void;

declare type sequelize$Attributes = {
    include?: Array<string>,
    exclude?: Array<string>,
}

declare type sequelize$IncludeOptions = {
    model: sequelize$Model,
    as: string,
}

declare class sequelize$Model {
    removeAttribute(attribute: string): void,
    sync(): Promise<*>,
    drop(options?: sequelize$DropOptions): Promise<*>,
    schema(schema: string, options?: sequelize$SchemaOptions): this,
    getTableName(options?: sequelize$ModelOptions): string | Object,
    unscoped(): sequelize$Model,
    addScope(name: string, scope: sequelize$Scope,
        options?: sequelize$ScopeOptions): void,
    scope(options?: Array<*> | Object | string): sequelize$Model,
}