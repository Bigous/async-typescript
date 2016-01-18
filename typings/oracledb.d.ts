declare module 'oracledb' {
	export interface ILob {
		chunkSize: number;
		length: number;
		pieceSize: number;
		type: string;
	}

	export interface IConnectionAttributes {
		user?: string;
		password?: string;
		connectString: string;
		stmtCacheSize?: number;
		externalAuth?: boolean;
	}

	export interface IPoolAttributes extends IConnectionAttributes {
		poolMax?: number;
		poolMin?: number;
		poolIncrement?: number;
		poolTimeout?: number;
	}

	export interface IExecuteOptions {
		maxRows?: number;
		prefetchRows?: number;
		outFormat?: number;
		resultSet?: boolean;
		autoCommit?: boolean;
	}

	export interface IExecuteReturn {
		rowsAffected?: number;
		outBinds?: Array<any> | Object;
		metaData?: Array<IMetaData>;
		rows?: Array<Array<any>> | Array<Object>;
		resultSet?: IResultSet;
	}

	export interface IMetaData {
		name: string;
	}

	export interface IResultSet {
		metaData?: Array<IMetaData>;
		close(callback: (err: any) => void): void;
		getRow(callback: (err: any, row: Array<any> | Object) => void): void;
		getRows(rowCount: number, callback: (err: any, rows: Array<Array<any>> | Array<Object>) => void): void;
	}

	export interface IConnection {
		/** Statement cache size in bytes (read-only)*/
		stmtCacheSize: number;
		/** Client id (to be sent to database) (write-only)*/
		clientId: string;
		/** Module (write-only) */
		module: string;
		/** Action */
		action: string;
		/** Oracle server version */
		oracleServerVersion: number;

		/**
		 * Execute method on Connection class.
		 * @param	{string} sql SQL Statement.
		 * @param	{Object|Array<any>} Binds Binds Object/Array (optional)
		 * @param	{IExecuteOptions} options Options object (optional)
		 * @param	{Function} callback Callback function to receive the result.
		 */
		execute(sql: string,
			binds?: Object | Array<any>,
			options?: IExecuteOptions,
			callback?: (err: any, value: IExecuteReturn) => void): void;

		/**
		 * Release method on Connection class.
		 * @param	{Function} callback Callback function to be called when the connection has been released.
		 */
		release(callback: Function);

		/**
		 * Send a commit requisition to the database.
		 * @param	{Function} callback Callback on commit done.
		 */
		commit(callback: Function);

		/**
		 * Send a rollback requisition to database.
		 * @param	{Function} callback Callback on rollback done.
		 */
		rollback(callback: Function);

		/**
		 * Send a break to the database.
		 * @param	{Function} callback Callback on break done.
		 */
		break(callback: Function);
	}

	export interface IConnectionPool {
		poolMax: number;
		poolMin: number;
		poolIncrement: number;
		poolTimeout: number;
		connectionsOpen: number;
		connectionsInUse: number;
		stmtCacheSize: number;
		terminate(callback: (err: any) => void): void;
		getConnection(callback: (err: any, connection: IConnection) => void): void;
	}

	export var DEFAULT: number;
	export var STRING: number;
	export var NUMBER: number;
	export var DATE: number;
	export var CURSOR: number;
	export var BUFFER: number;
	export var CLOB: number;
	export var BLOB: number;
	export var BIND_IN: number;
	export var BIND_INOUT: number;
	export var BIND_OUT: number;
	export var ARRAY: number;
	export var OBJECT: number;

	export function newLob(iLob: ILob);
	export function getConnection(connectionAttributes: IConnectionAttributes, callback: (err: any, connection: IConnection) => void): void;
	export function createPool(poolAttributes: IPoolAttributes, callback: (err: any, connection: IConnectionPool) => void): void;

	export var poolMax: number;
	export var poolMin: number;
	export var poolIncrement: number;
	export var poolTimeout: number;
	export var stmtCacheSize: number;
	export var prefetchRows: number;
	export var autoCommit: boolean;
	export var maxRows: number;
	export var outFormat: number;
	export var version: number;
	export var connectionClass: string;
	export var externalAuth: boolean;
	export var fetchAsString: any;
	export var lobPrefetchSize: number;
	export var oracleClientVersion: number;
}
