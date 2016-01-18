'use strict';
var OracleDB = require('oracledb');
class OraclePromisses {
    getConnection(opt) {
        return new Promise((res, rej) => {
            OracleDB.getConnection(opt, (err, connection) => {
                return err ? rej(err) : res(connection);
            });
        });
    }
    query(sql, binds, options, conn) {
        return new Promise((res, rej) => {
            conn.execute(sql, binds, options, (err, val) => {
                return err ? rej(err) : res(val);
            });
        });
    }
    getAllRows(exeRet) {
        return new Promise((res, rej) => {
            console.log('getRows', exeRet);
            if (exeRet.rows) {
                res(exeRet.rows);
            }
            else {
                let ret = [];
                function populaRows(ret, rs) {
                    rs.getRows(20, (err, rows) => {
                        rows.forEach(val => ret.push(val));
                        if (rows.length < 20) {
                            rs.close((err) => {
                                return err ? rej(err) : res(ret);
                            });
                        }
                        else {
                            populaRows(ret, rs);
                        }
                    });
                }
                populaRows(ret, exeRet.resultSet);
            }
        });
    }
}
class App {
    constructor() {
        this.connAtt = {
            user: "rnjesus",
            password: "Bigous*123",
            connectString: "retecsp1tm.world"
        };
        this.ora = new OraclePromisses();
    }
    run() {
        let opt = {
            resultSet: true
        };
        this.ora.getConnection(this.connAtt)
            .then(this.ora.query.bind(this, 'select num_ele_int from cad_topo_int where cod_situ_int <> :situ and rownum <= :rn', ['RM', 20], opt))
            .then(this.ora.getAllRows)
            .then(console.log)
            .catch(console.error);
    }
}
new App().run();
