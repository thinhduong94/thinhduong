import { User } from "../model/user";
import { dbUser } from "../db/dbUser";



export class userService {
    private user: User;
    private db: dbUser;
    constructor() {
        this.db = new dbUser();
        this.user = new User();
    }
    public getAll(callback) {
        let users = new Array<User>();

        this.db.getAll(function (err, Result) {
            //you might want to do something is err is not null...      
            callback(err, Result)

        });
    }
    public getUserById(id: string): User {
        let user = new User();
        return user;
    }
    public login(userName: string, passWord: string, callback) {
        console.log(userName+'/'+passWord);
        this.db.login(userName, passWord, function (err, Result) {
            //you might want to do something is err is not null...      
            callback(err, Result)

        });
    }
    public register(user:User,callback){
        console.log(JSON.stringify(user));
        this.db.register(user, function (err, Result) {
            //you might want to do something is err is not null... 
            Result.user = user;
            callback(err, Result)

        });
    }
    public logOut(): void {

    }

}