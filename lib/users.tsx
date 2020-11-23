import { connectToDatabase } from "./mongodb";


export async function getUserDetails(userId: string) {

	const { db } = await connectToDatabase();
	const user = await db.collection('users').findOne({ id: userId }, { projection: { name: 1 } });
	// console.log('getUserDetails: ' + JSON.stringify(user, null, 2));
	return user;
}





