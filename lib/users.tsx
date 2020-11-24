import { connectToDatabase } from "./mongodb";


const localUserCache = {};


export async function getUserDetails(userId: string) {

	if (!localUserCache[userId]) {
		const { db } = await connectToDatabase();
		const user = await db.collection('users').findOne({ id: userId });
		// console.log('getUserDetails: ' + JSON.stringify(user, null, 2));
		localUserCache[userId] = user;
	}
	return localUserCache[userId];
}


export async function getUserByName(name: string) {
	const { db } = await connectToDatabase();
	const user = await db.collection('users').findOne({ name: name });
	// console.log('getUserByName: ' + JSON.stringify(user, null, 2));
	return user;	
}


export async function createUser(name: string) {
	const { db } = await connectToDatabase();
	const userId = await getNextUserId();
	const userInsertionResult = await db.collection('users').insert({ id: userId, name: name });
	console.log('createUser: ' + JSON.stringify(userInsertionResult, null, 2));
	return userInsertionResult.ops[0];	
}


async function getNextUserId() {
	const { db } = await connectToDatabase();
	const highestIdResult = await db.collection('users').find({}).project({ id: 1 }).sort({ id: -1 }).limit(1).toArray();
	const highestId = highestIdResult[0].id;
	// console.log('getNextUserId ' + highestId);
	return highestId + 1;
}




