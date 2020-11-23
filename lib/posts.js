import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import remark from 'remark';
import html from 'remark-html'; 

const postsDirectory = path.join(process.cwd(), 'posts');

// This is the right place to fetch data from an external source 
// as long as it is returned as JSON
export function getSortedPostsData() {
  // Get file names under /posts
  const fileNames = fs.readdirSync(postsDirectory)
  const allPostsData = fileNames.map(fileName => {
    // Remove ".md" from file name to get id
    const id = fileName.replace(/\.md$/, '')

    // Read markdown file as string
    const fullPath = path.join(postsDirectory, fileName)
    const fileContents = fs.readFileSync(fullPath, 'utf8')

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents)

    // Combine the data with the id
    return {
      id,
      ...matterResult.data
    }
  })
  // Sort posts by date
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1
    } else {
      return -1
    }
  })
}


export function getAllPostIds() {
  const fileNames = fs.readdirSync(postsDirectory);
  var returnObject = fileNames.map(fileName => { 
    return {
    params: {
      id: fileName.replace(/\.md$/, '')
    }
  }});
  console.log('getAllPostIds(): return object is ' + JSON.stringify(returnObject, null, 2));
  return returnObject;
}


export async function getPostData(id) {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  const matterResult = matter(fileContents);

  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  // Combine the data with the id and contentHtml 
  return {
    id,
    contentHtml,
    ...matterResult.data
  };

}
