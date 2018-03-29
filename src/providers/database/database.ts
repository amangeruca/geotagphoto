import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
 
@Injectable()
export class Database {
    options: any = {
        name: 'data.db',
        location: 'default'
    }
   
    private db: SQLiteObject;

    constructor(private sqlite: SQLite) {
        this.connectToDb();
    }

    private connectToDb(): void{
        this.sqlite.create(this.options)
            .then((db: SQLiteObject)=>{
                this.db = db;
                let sql = "CREATE TABLE IF NOT EXISTS 'tagphotos' (\
                        \ id varchar(50), id_usr int,\
                        \ appsrc VARCHAR(100), id_album int, note varchar(255),\
                        \ datapick varchar(50),  isstored boolean,\
                        \ x real, y real)";
                this.db.executeSql(sql, {})
                .then(()=>{console.log("CREATE TABLE")})
                .catch(e => console.log(e))
            })

            .catch(e => console.log(e))
    }

    addTagPhoto(photo): void{
        let sql: string = "INSERT INTO 'tagphotos' VALUES "
                + "('" + photo.id + "', " +  photo.id_usr 
                + ", '" + photo.appsrc + "', " + photo.id_album + ", '" + photo.note 
                + "', '" + photo.datapick + "', " + photo.isstored
                + ", " + photo.x + ", " + photo.y + ")";
        this.db.executeSql(sql, {})
        .then(()=>{console.log("INSERT TAGPHOTO")})
        .catch(e => console.log(e))
    }

    remTagPhoto(id): void{
        let sql: string = "DELETE FROM 'tagphotos' WHERE "
                        + "id = '" + id + "'";
        this.db.executeSql(sql, {})
        .then(()=>{console.log("DELETE TAGPHOTO")})
        .catch(e => console.log(e))
    }
}