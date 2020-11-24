import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from "../../../lib/mongodb";


export default async (req: NextApiRequest, res: NextApiResponse) => {

	const { db } = await connectToDatabase();

	console.log('/api/posts/update: updating post id=' + req.body.id + ' with title ' + req.body.title + ' with body ' + req.body.post);
	
	try {
		const updateValues = { $set: { "title": req.body.title, "body": req.body.post } };

		const updateResult = await db.collection('posts').updateOne({ id: Number(req.body.id) }, updateValues);

		// console.log('/api/posts/update: Successfully updated post  ' + JSON.stringify(updateResult, null, 2));		
		console.log('/api/posts/update: Successfully updated post  ' + req.query.id);
		res.status(200).send({ success: true });
		return;
			
	} catch (e) {
		console.error('/api/posts/update: Update failed, error details are ' + e.stack);
		res.status(500).send({});		
	}

}