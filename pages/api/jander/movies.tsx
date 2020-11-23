import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from "../../../lib/mongodb";


export default async (req: NextApiRequest, res: NextApiResponse) => {
	const { db } = await connectToDatabase();

	const movies = await db
    .collection("movies")
    .find({})
    .sort({ metacritic: -1 })
    .limit(20)
    .toArray();

  	res.json(movies);
}