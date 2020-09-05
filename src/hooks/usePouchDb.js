import PouchDB from "pouchdb-browser";


export function usePouchDb(){
    let db = new PouchDB("todo_");
    return db;
}