#!/usr/bin/env node

import * as admin from "firebase-admin";
import * as csv from "csvtojson";
import * as fs from "fs-extra";
import * as args from "commander";

args
  .version("1.0.0")
  .option("-s, --src <path>", "Source file path")
  .option("-c, --collection <path>", "collection path in db")
  .option("-i, --id [id]", "document ID (optional)")
  .parse(process.argv);

const serviceAccount = require("../creds.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const migrate = async () => {
  try {
    const collection = args.collection;
    const file = args.src;

    if (!collection || !file) {
      console.log("invalid args");
      return;
    }

    const collectionRef = db.collection(collection);

    const data = await fs.readJSON(file);
    let i = 0;

    let docData = [];
    for (const document of data) {
      const id = collectionRef.doc().id;

      if ("Fecha" in document) {
        let timeStamp = admin.firestore.Timestamp.fromDate(
          new Date(document.Fecha)
        );
        document.Fecha = timeStamp;
      }

      const docRef = collectionRef.doc(id);
      docData.push({ docRef, document });
    }
    console.log("loaded documents into cache");
    let k = 0;
    while (k < docData.length) {
      console.log("starting batch on document " + k);
      const batch = db.batch();
      let j = 0;
      while (j < 300 && k < docData.length) {
        batch.set(docData[k].docRef, docData[k].document);
        j++;
        k++;
      }
      await batch.commit();
    }
  } catch (err) {
    console.log("Migration error: " + err.message);
  }
};

//run
migrate();
