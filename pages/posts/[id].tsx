// Files named between brackets are Dynamic Routes in NextJS

import Layout from '../../components/layout';
import { getAllPostIds, getPostData } from '../../lib/posts';
import Head from 'next/head';
import utilStyles from '../../styles/utils.module.css';
import { GetStaticProps, GetStaticPaths } from 'next';

							 // This 👇 parameter is the props returned by getServerSide... 
export default function Post({ postData } :
								 { postData: {
								 	title: string;
								 	date: string;
								 	contentHtml: string;
								 	author: string;
								 } 
							}) {
	return (<Layout>
			<Head>
				<title>{ postData.title }</title>
			</Head>
				<article>
					<h1 className={ utilStyles.headingX1 }>{ postData.title }</h1>
					<div className={ utilStyles.lightText }>
						{ postData.author }
					</div>		
					<div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
				</article>
			</Layout>
	);
}


export const getStaticPaths: GetStaticPaths = async () => {
	// Return a list of possible value for id
	const paths = await getAllPostIds();
	return {
		paths,
		fallback: false
	};
}


export const getStaticProps: GetStaticProps = async ({ params }) => {
	// Fetch necessary data for the blot post using params.id
	const postData = await getPostData(params.id as string);
	return {
		props: {
			postData
		}
	};
}

