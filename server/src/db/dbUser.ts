import { db } from "./db";
import { User } from "../model/user";

export class dbUser {
    private con;
    constructor() {
        this.con = new db().getConnection();
    }
    public getAll(callback) {
        this.con.query("SELECT * FROM user", function (err, rows) {
            //here we return the results of the query
            callback(err, rows);
        });
    }
    public login(userName: string, passWord: string, callback) {
        console.log(userName+'/'+passWord);
       
        let sql = "SELECT * FROM user WHERE userName = '"+userName+"' AND passWord='"+passWord+"'";
        console.log(sql);
        this.con.query(sql, function (err, rows) {
            //here we return the results of the query
            callback(err, rows);
        });
    }
    public register(user:User, callback) {
        let sql = "INSERT INTO user (userName,passWord,name) VALUES ('"+user.userName+"','"+user.passWord+"','"+user.name+"')";
        console.log(sql);
        this.con.query(sql, function (err, rows) {
            //here we return the results of the query
            callback(err, rows);
        });
    }
}