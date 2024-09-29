// Import the express module to create an Express application
import express from "express";
// Import the database connection from the specified path
//import db from "../db/conn.mjs";
import { connectToDatabase } from '../db/conn.mjs'; 

// Import the ObjectId class from the mongodb package to work with MongoDB Object IDs
import { ObjectId } from "mongodb";

// Create a new router instance using Express
const router = express.Router();
const db = await connectToDatabase();

// GET ALL RECORDS
// Define a route to get all the records from the "posts" collection

router.get("/", async (req, res) => {
    try {
        console.log("GET /posts/ route hit");
        
        //const db = await connectToDatabase();

        let collection = db.collection("posts");

        // Find all documents in the "posts" collection and convert them to an array
        let results = await collection.find({}).toArray();

        // Log the results
        console.log("Results:", results);

        // Send the results as the response with a status code of 200 (OK)
        res.status(200).send(results);
    } catch (error) {
        console.error("Error in GET /posts/ route:", error);
        res.status(500).send("Internal Server Error");
    }
});
//CREATE A RECORD [ username, content , picture]
// Define a route to create a new record in the "posts" collection
/*router.post("/upload", async (req, res) => {
    // Create a new document using the data from the request body

   
    let newDocument = {
        user: req.body.user,
        content: req.body.content,
        image: req.body.image
    };

    // Get a reference to the "posts" collection from the database
    let collection = await db.collection("posts");
    
    // Insert the new document into the "posts" collection
    let result = await collection.insertOne(newDocument);
    
    // Send the result of the insertion as the response with a status code of 204 (No Content)
    res.status(204).send(result);

    res.send('Upload endpoint hit with data: ' + JSON.stringify(req.body));
});*/
router.post("/upload", async (req, res) => {
    try {
        // Create a new document using the data from the request body
        let newDocument = {
            user: req.body.user,
            content: req.body.content,
            image: req.body.image
        };

        // Log the new document to the console (for debugging purposes)
        console.log('New document:', newDocument);

        // Get a reference to the "posts" collection from the database
        
        let collection = await db.collection("posts");
        let result = await collection.insertOne(newDocument);

        // Send a response back to the client
        res.status(200).send('Upload endpoint hit with data: ' + JSON.stringify(req.body));
    } 
    catch (error) {
        console.error("Error in POST /upload route:", error);
        res.status(500).send("Internal Server Error");
    }
});

// UPDATE A RECORD BY ID 
router.patch("/:id", async (req, res) => {
    const query = { _id: new ObjectId(req.params.id) };
    const updates = {
    $set: {
    name: req.body.name,
    comment: req.body.comment
    }
};
    
    let collection = await db.collection("posts");
    let result = await collection.updateOne(query, updates);
    
    res.send(result).status(200);
});
    
// GET A SINGLE RECORD BY ID
    router.get("/:id", async (req, res) => {
    let collection = await db.collection("posts");
    let query = {_id: new ObjectId(req.params.id)};
    let result = await collection. findOne(query);
    
    if (!result)
        { 
            res.send("Not found").status(404);
        }else 
        {
            res.send(result).status(200);
        }

});

// DELETE A SINGLE RECORD BY ID
router.delete("/:id", async (req, res) => {
   
    const query = {_id: new ObjectId(req.params.id)};
    const collection =  await db.collection("posts");
    let result = await collection.deleteOne(query);
    
    if (!result)
        { 
            res.send("Not found").status(404);
        }else 
        {
            res.send(result).status(200);
        }

});
// Export the router as the default export
export default router;