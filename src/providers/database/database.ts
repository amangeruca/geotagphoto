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
                let sql = "CREATE TABLE IF NOT EXISTS tagphotos (\
                        \ id integer primary key, id_user int, imgname varchar(50),\
                        \ appsrc VARCHAR(100), id_album int, note varchar(255),\
                        \ datapick varchar(50),  isstored boolean,\
                        \ x real, y real)";
                return this.db.executeSql(sql, {})
            })
            .then(()=>{
                console.log("CREATE TABLE")
            })
            .catch(e => {
                console.log(e)
            })
    }

    addTagPhoto(photo): any{
        let sql: string = "INSERT INTO tagphotos ("
                + "id_user, imgname, appsrc, id_album, note, datapick, isstored, x, y) VALUES "
                + "(" + photo.id_user + ", '" + photo.imgname + "', '" + photo.appsrc
                + "', " + photo.id_album + ", '" + photo.note 
                + "', '" + photo.datapick + "', " + photo.isstored
                + ", " + photo.coords.latitude + ", " + photo.coords.longitude + ")";
                
        return this.db.executeSql(sql, {})
        // .then(()=>{console.log("INSERT TAGPHOTO")})
        // .catch(e => console.log(e))
    }

    getTagPhotoNotStored(): any{
        let sql: string = "SELECT * FROM tagphotos "
                        + "WHERE isstored = 0";
        return this.db.executeSql(sql, {})


    }

    remTagPhoto(id): any{
        let sql: string = "DELETE FROM tagphotos WHERE "
                        + "id = '" + id + "'";
        return this.db.executeSql(sql, {})

    }
    
    setTagPhotoAsStored(id): any{
        let sql: string = "UPDATE tagphotos SET isstored = 1 WHERE "
                        + "id = " + id;
        return this.db.executeSql(sql, {})

    }
}