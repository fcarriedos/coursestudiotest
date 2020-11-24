import Head from 'next/head';
import Layout, { siteTitle } from '../components/layout';
import utilStyles from '../styles/utils.module.css';
import { getSortedPostsData } from '../lib/posts';
import Link from 'next/link';
import { GetStaticProps, GetStaticPaths, GetServerSideProps } from 'next';
import styles from '../components/layout.module.css';
import updateStyles from './posts/update/updateStyles.module.css';
import axios from 'axios';
import Swal from 'sweetalert2';
import React from 'react';




export default function Home({ allPostsData } :
                             { allPostsData : {
                               date: string,
                               title: string,
                               id: string,  
                             }[]
                            }) {

  // Handle functions here...
  function createPost(event) {
    event.preventDefault();
    window.location.href = '/posts/create';  
  }

  function deletePost(event) {
    event.preventDefault();
    var postElement = event.target.closest('li');
    var postId = '30';

    Swal.fire({
      title: '🗑 Are you sure?',
      html: 'This cannot be undone!',
      showCancelButton: true,
      confirmButtonText: 'Delete',
    }).then((result) => {
      if (result.isConfirmed) {
        // Remove the post from DB
        console.log('User approved post deletion for id ' + postId);
        axios.get('/api/posts/delete?id=' + postId)
        .then(response => {
          // Remove the post from UI
          if (response.data.success) postElement.remove();
        })
        .catch(error => {
          Swal.fire({ icon: 'error',
                      title: 'Oops...',
                      text: 'Could not delete your post!'});
        });     
      } 
    });
  }

  return (
     <Layout home>
       <Head>
         <title>{ siteTitle }</title>
       </Head>
       <section className={ utilStyles.headingMd }>
         <h5 className={ styles.centeredHeading }>Welcome to my blog, where I feature my friends' posts!</h5>
       </section>
       <section className={` ${utilStyles.headingMd} ${utilStyles.padding1px} `}>
         <h2 className={utilStyles.headingLg}>Posts</h2>
         <ul className={utilStyles.list}>
           {allPostsData.map(({ id, date, title }) => (
             <li className={utilStyles.listItem} key={id}>
               <Link href={`/posts/${id}`}>
                <a>{title}</a>
               </Link>
               <br />
                 <small className={utilStyles.lightText}>
                   By {date}
                 </small>
                 <div className={styles.actionLink}>
                 </div>
             </li>
           ))}
         </ul>
         <div className={ updateStyles.row }>
           <input className={ updateStyles.createPostButton } type="submit" value="Create post" onClick={ createPost } />
         </div>
       </section>
     </Layout>
  );
}


// These two methods only execute on the server side
export const getServerSideProps: GetStaticProps = async () => {

  const allPostsData = await getSortedPostsData(); 

  return {
    props: { 
      allPostsData
    }
  };

}

