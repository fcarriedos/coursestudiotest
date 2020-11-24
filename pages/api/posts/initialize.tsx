import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from "../../../lib/mongodb";
import axios from 'axios';

// TODO: this as an environment variable
const USERS_ENDPOINT = 'https://jsonplaceholder.typicode.com/users';
const POSTS_ENDPOINT = 'https://jsonplaceholder.typicode.com/posts';


export default async (req: NextApiRequest, res: NextApiResponse) => {

	const { db } = await connectToDatabase();

	var postsInitalized = await initializePosts(db);
	var usersInitalized = await initializeUsers(db);
	if (postsInitalized && usersInitalized) {
		res.json({ status: 'OK' });
		return;
	} 	
	res.status(500).send({});
}


async function initializePosts(db) {
	
	try {
		await dropCollection(db, 'posts');
    console.error('Dropping post collection at startup...');
    var existingPosts = await axios.get(POSTS_ENDPOINT);
    var allPosts = existingPosts.data;
		while (allPosts.length > 0) {
			const postBatch = allPosts.splice(0, 10);
			// console.log('postBatch: ' + JSON.stringify(postBatch, null, 2));
			const insertionResult = await db.collection('posts')
			      							.insertMany(postBatch);
			// console.log('Insertion result: ' + JSON.stringify(insertionResult, null, 2));
		}
		return true;
	} catch(e) { 
		console.error('initializePosts(): could not initialize post collection, error details: ' + e.stack); 
	}
	
}


async function initializeUsers(db) {
	
	try {
		await dropCollection(db, 'users');
		console.error('Dropping user collection at startup...');
		var existingUsers = await axios.get(USERS_ENDPOINT);

		var userData = existingUsers.data;
		// console.log('initializeUsers(): relevant user data ' + JSON.stringify(userData, null, 2));

		while (userData.length > 0) {
			const userBatch = userData.splice(0, 10);
			const insertionResult = await db.collection('users')
			      .insertMany(userBatch);
			// console.log('initializeUsers(): insertion result: ' + JSON.stringify(insertionResult, null, 2));
		}
		return true;
	} catch(e) { 
		console.error('initializePosts(): could not initialize user collection, error details: ' + e.stack); 
	}

}


async function dropCollection(db, collectionName) {
  try {
    await db.collection(collectionName).drop();
    console.error('Dropping user collection at startup...');
  } catch (e) {

  }
  await db.createCollection(collectionName);
}


