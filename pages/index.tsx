import Head from 'next/head';
import Layout, { siteTitle } from '../components/layout';
import utilStyles from '../styles/utils.module.css';
import { getSortedPostsData } from '../lib/posts';
import Link from 'next/link';
// import Date from '../components/date';
import { GetStaticProps, GetStaticPaths, GetServerSideProps } from 'next';


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
         <p>Francisco here, checking out NextJS, good stuff!</p>
         <p>
           (This is a sample website - you'll be building a site like this on {' '}
             <a href="https://nextjs.org/learn">our Next.js tutorial</a>.)
         </p>
       </section>
       <section className={` ${utilStyles.headingMd} ${utilStyles.padding1px} `}>
         <h2 className={utilStyles.headingLg}>Blog</h2>
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
