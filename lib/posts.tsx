import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import remark from 'remark';
import html from 'remark-html'; 
import { connectToDatabase } from "./mongodb";
import { getUserDetails } from './users';

// const postsDirectory = path.join(process.cwd(), 'posts');

// This is the right place to fetch data from an external source 
// as long as it is returned as JSON
export async function getSortedPostsData() {
  


  // TODO: get the info from the database and 
  // return it as it is returned right now

  // Get file names under /posts
  const { db } = await connectToDatabase();
  const allPostFromDB = await db.collection('posts')
                                .find({})
                                .sort({ title: 1 })
                                .toArray();

  // console.log('getAllPostIds(): return object is ' + JSON.stringify(allPostFromDB, null, 2));

  var allPostsData = [];
  for (let post of allPostFromDB) {
    var userDetails = await getUserDetails(post.userId);
    if (!userDetails) {
      console.log('-----------> User details null for ' + JSON.stringify(post, null, 2));
      continue;
    }
    allPostsData.push({
      id: Number(post.id),
      date: userDetails.name,
      title: post.title
    });
  }

  // const allPostsData = allPostFromDB.map(post => {
  //   return {
  //     id: Number(post.id),
  //     date: post.userId,
  //     title: post.title,
  //     // body: post.body
  //   }
  // });

  return allPostsData;

  // const fileNames = fs.readdirSync(postsDirectory)
  // const allPostsData = fileNames.map(fileName => {
  //   // Remove ".md" from file name to get id
  //   const id = fileName.replace(/\.md$/, '');

  //   // Read markdown file as string
  //   const fullPath = path.join(postsDirectory, fileName);
  //   const fileContents = fs.readFileSync(fullPath, 'utf8');

  //   // Use gray-matter to parse the post metadata section
  //   const matterResult = matter(fileContents)

  //   // Combine the data with the id
  //   return {
  //     id,
  //     ...(matterResult.data as { date: string; title: string })
  //   }
  // })
  // Sort posts by date
  // return allPostsData.sort((a, b) => {
  //   if (a.date < b.date) {
  //     return 1
  //   } else {
  //     return -1
  //   }
  // })
}


export async function getAllPostIds() {

  // TODO: get the info from the database and 
  // return it as it is returned right now
  const { db } = await connectToDatabase();
  const allPosts = await db.collection('posts').find({}).project({ id: 1 }).sort({ title: 1 }).toArray();

  var returnObject = allPosts.map(post => { 
    return {
    params: {
      // TODO: there shouldn't be a need for any casting
      id: String(post.id) 
    }
  }});

  // console.log('getAllPostIds(): return object is ' + JSON.stringify(returnObject, null, 2));
  return returnObject;

}


export async function getPostData(id: number) {

  // TODO: get the info from the database and 
  // return it as it is returned right now

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

  // const fullPath = path.join(postsDirectory, `${id}.md`);
  // const fileContents = fs.readFileSync(fullPath, 'utf8');

  // const matterResult = matter(fileContents);

  // const processedContent = await remark()
  //   .use(html)
  //   .process(matterResult.content);
  // const contentHtml = processedContent.toString();

  // // Combine the data with the id and contentHtml 
  // return {
  //   id,
  //   contentHtml,
  //   ...(matterResult.data as { date: string; title: string })
  // };

}


