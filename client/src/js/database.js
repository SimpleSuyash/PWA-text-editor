import { openDB } from "idb";

const initdb = async () =>
  openDB("jate", 1, {
    upgrade(db) {
      if (db.objectStoreNames.contains("jate")) {
        console.log("jate database already exists");
        return;
      }
      db.createObjectStore("jate", { keyPath: "id", autoIncrement: true });
      console.log("jate database created");
    },
  });

//  accepts some content and adds it to the database
export const putDb = async (content) => {
  console.log("PUT to indexedDB");
  const jateDb = await openDB("jate", 1);
  const tx = jateDb.transaction("jate", "readwrite");
  const store = tx.objectStore("jate");
  const updateRequest = store.put({id:1, value: content });
  const result = await updateRequest;
  console.log("Data saved to indexedDB", result);
};

//  gets all the content from the database
export const getDb = async () => {
  console.log("GET from indexedDB");
  const jateDb = await openDB("jate", 1);
  const tx = jateDb.transaction("jate", "readonly");
  const store = tx.objectStore("jate");
  //there is only one content in the database
  // get the content with id 1
  const getRequest = store.get(1);
  const result = await getRequest;
  console.log("Data retrieved from indexedDB", result);
  return result ? result.value : null;
};

initdb();
