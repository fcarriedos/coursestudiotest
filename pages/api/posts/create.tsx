import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from "../../../lib/mongodb";
import { getUserByName, createUser } from '../../../lib/users';


export default async (req: NextApiRequest, res: NextApiResponse) => {

	const { db } = await connectToDatabase();

	console.log('/api/posts/create: creating post for user ' + req.body.user + ' with title ' + req.body.title + ' with body ' + req.body.post);
	
	try {

		const postId = await getNextPostId();

		var user = await getUserByName(req.body.user);

		if (!user) {
			user = await createUser(req.body.user);
		}

		console.log('User id is ' + user.id);

		const insertionResult = await db.collection('posts').insertOne({ id: postId, userId: user.id, title: req.body.title.toLowerCase(), body: req.body.post });

		// console.log('/api/posts/create: Successfully inserted post  ' + JSON.stringify(insertionResult, null, 2));		
		res.status(200).send({ success: true });
		return;
			
	} catch (e) {
		console.error('/api/posts/create: create failed, error details are ' + e.stack);
		res.status(500).send({});		
	}

}



async function getNextPostId() {
	const { db } = await connectToDatabase();
	const highestIdResult = await db.collection('posts').find({}).project({ id: 1 }).sort({ id: -1 }).limit(1).toArray();
	const highestId = highestIdResult[0].id;
	// console.log('getNextPostId ' + highestId);
	return highestId + 1;
}

