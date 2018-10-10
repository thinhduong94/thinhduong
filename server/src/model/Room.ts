export class Room{
    public id:string;
    public name:string;
    public type:string;
    public status:number;
    public user_created:string;
    public user_friend:string;
    public content:string;
    public listUserIdInRoom:any[] = [];
    constructor(){

    }
}