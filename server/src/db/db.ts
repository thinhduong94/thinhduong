
import * as mysql from 'mysql';
export class db {
  private con:mysql.Connection;
  constructor(){
    this.con = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "chatapp",
      charset : 'utf8mb4'
    });
  }
  public getConnection(){
    console.log("aaaaa");
    return this.con;
  }
}