import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from "../../../lib/mongodb";


export default async (req: NextApiRequest, res: NextApiResponse) => {

	const { db } = await connectToDatabase();

	console.log('/api/posts/delete: deleting post id=' + req.query.id);

	const deletionResult = await db.collection('posts').deleteOne({ id: Number(req.query.id) });
	
	if (deletionResult && deletionResult.deletedCount) {
		console.log('/api/posts/delete: Successfully deleted post  ' + req.query.id);
		res.status(200).send({ success: true });
		return;
	}
	console.error('/api/posts/delete: Deletion failed, database returned ' + JSON.stringify(deletionResult, null, 2));
	res.status(500).send({});
}