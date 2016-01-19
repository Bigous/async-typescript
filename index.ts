'use strict';

import {IConnectionAttributes, IConnection, IExecuteOptions, IExecuteReturn} from 'oracledb';
import * as OracleDB from 'oracledb';

class OraclePromisses {
	getConnection(opt: IConnectionAttributes): Promise<IConnection> {
		return new Promise<IConnection>((res, rej) => {
			OracleDB.getConnection(opt, (err, connection) => {
				return err ? rej(err) : res(connection);
			});
		});
	}

	query(sql:string, binds: Object | Array<any>, options: IExecuteOptions, conn): Promise<IExecuteReturn> {
		return new Promise<IExecuteReturn>((res, rej) => {
			conn.execute(sql, binds, options, (err, val) => {
				return err ? rej(err) : res(val);
			});
		});
	}

	getAllRows(exeRet: IExecuteReturn): Promise<Array<Array<any>> | Array<Object>> {
		return new Promise<Array<Array<any>> | Array<Object>>((res, rej) => {
			if (exeRet.rows) {
				res(exeRet.rows);
			} else {
				let ret: Array<Array<any>> | Array<Object> = [];
				function populaRows(ret, rs) {
					rs.getRows(20, (err, rows) => {
						rows.forEach(val => ret.push(val));
						if (rows.length < 20) {
							rs.close((err) => {
								return err ? rej(err) : res(ret);
							});
						} else {
							populaRows(ret, rs);
						}
					});
				}
				populaRows(ret, exeRet.resultSet);
			}
		});
	}

	releaseConnection(connection: IConnection): Promise<void> {
		return new Promise<void>((res, rej) => {
			if (connection == null) {
				// Nothing to release
				return res();
			} else {
				// Lets release...
				connection.release((err) => {
					return err ? rej(err) : res();
				});
			}
		});
	}
}

class App {
	connAtt = {
		user: "rnjesus",
		password: "Bigous*123",
		connectString: "retecsp1tm.world"
	};
	ora = new OraclePromisses();

	run() {
		let opt: IExecuteOptions = {
			resultSet: true
		};
		this.ora.getConnection(this.connAtt)
			.then(conn => {
				// Connection is tied to this then execution...
				// It will be released at the end of this chain.
				return this.ora.query('select num_ele_int from cad_topo_int where cod_situ_int <> :situ and rownum <= :rn', { situ: 'RM', rn: 20 }, opt, conn)
					.then(this.ora.getAllRows)
					.then(console.log)
					// any exception or rejection wil be catch here
					.catch(console.log.bind(console))
					// releasing the connection - exceptions during this process are not catched by the catch above...
					// We have 3 options so...
					//  1. Do nothing and let the error be thown.
					//  2. Catch it after this then
					//  3. Return the promisse so the father promisse may decide what to do. <- choosen option
					.then(this.ora.releaseConnection.bind(this.ora, conn));
			})
			// another catch - will catch problems during connection aquiring (getConnection) and release (releaseConnection from the internal promisse of prior then which was returned);
			.catch(console.log.bind(console));
	}
}

new App().run();
