import PouchDB from "pouchdb-browser";

export function usePouchDb(dbName) {
  let db = new PouchDB(dbName);
  return db;
}
