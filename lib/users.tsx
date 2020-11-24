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





