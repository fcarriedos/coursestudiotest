import { connectToDatabase } from "./mongodb";
import { getUserDetails } from './users';


export async function getSortedPostsData() {
  
  const { db } = await connectToDatabase();
  const allPostFromDB = await db.collection('posts')
                                .find({})
                                .sort({ title: 1 })
                                .toArray();

  var allPostsData = [];
  for (let post of allPostFromDB) {
    var userDetails = await getUserDetails(post.userId);
    if (!userDetails) continue;
    allPostsData.push({
      id: Number(post.id),
      date: userDetails.name,
      title: post.title
    });
  }
  return allPostsData;
}


export async function getAllPostIds() {
  const { db } = await connectToDatabase();
  const allPosts = await db.collection('posts').find({}).project({ id: 1 }).sort({ title: 1 }).toArray();

  var returnObject = allPosts.map(post => { 
    return {
    params: {
      // TODO: there shouldn't be a need for any casting
      id: String(post.id) 
    }
  }});
  return returnObject;
}


export async function getPostData(id: string) {

  console.log('getPostData(): looking for post ' + id);

  const { db } = await connectToDatabase();
  const thePost = await db
                        .collection('posts')
                        // TODO: there shouldn't be a need for any casting
                        .findOne({ id: Number(id) });

  const theAuthor = await getUserDetails(thePost.userId);

  return {
    id: thePost.id,
    contentHtml: thePost.body,
    date: thePost.userId,
    title: thePost.title,
    author: theAuthor.name
  };

}


