import Head from 'next/head';
import Layout, { siteTitle } from '../components/layout';
import utilStyles from '../styles/utils.module.css';
import { getSortedPostsData } from '../lib/posts';
import Link from 'next/link';
// import Date from '../components/date';
import { GetStaticProps, GetStaticPaths, GetServerSideProps } from 'next';
import styles from '../components/layout.module.css';
import axios from 'axios';
import Swal from 'sweetalert2';


const MyButton = React.forwardRef(({ onClick, href }, ref) => {

  var onClick = (event) => {

    event.preventDefault();
    var postElement = event.target.closest('li');
    var postId = href.replace('/','');

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
  };

  return (
    <a href={href} onClick={onClick} ref={ref}>
      🗑 Delete
    </a>
  );
});


export default function Home({ allPostsData } :
                             { allPostsData : {
                               date: string,
                               title: string,
                               id: string,  
                             }[]
                            }) {
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
               <div className={styles.deleteButton}>
                <Link href={`/${id}`} passHref>
                  <MyButton />
                </Link>
                </div>
             </li>
           ))}
         </ul>
       </section>
     </Layout>
  );
}


// These two methods only execute on the server side
// export async function getStaticProps() {
export const getStaticProps: GetStaticProps = async () => {

  const allPostsData = await getSortedPostsData(); 

  return {
    props: { 
      allPostsData
    }
  };

}


// export async function getServerSideProps(context) {
//   return {
//     props: {

//     }
//   };
// }
