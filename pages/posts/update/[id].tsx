import Layout from '../../../components/layout';
import { getAllPostIds, getPostData } from '../../../lib/posts';
import utilStyles from '../../../styles/utils.module.css';
import Head from 'next/head';
import updateStyles from './updateStyles.module.css';


export default function Editor({ postData }) {

	console.log('PostData is: ' + JSON.stringify(postData, null, 2));

	function handleChange(event, other) {
		console.log('Hola! The event ' + event.target.value);
		event.target.value += event.target.value[event.target.value.length - 1];
	}

	// Handle functions here...

	return (<Layout>
			<Head>
				<title>Post editor</title>
			</Head>
				<div className={ updateStyles.container }>
				  <form>
				    <div className={ updateStyles.row }>
				      <div>
				        <label className={ updateStyles.label} for="title">Title</label>
				      </div>
				      <div>
				        <input className={ updateStyles.inputComponent } type="text" id="title" name="title" placeholder="This story's title is..."  value={ postData.title }/>
				      </div>
				    </div>
				    <div className={ updateStyles.row}>
				      <div>
				        <label className={ updateStyles.label} for="author">Author</label>
				      </div>
				      <div>
				        <input className={ updateStyles.inputComponent } type="text" id="author" name="author" placeholder="This story's author is..." value={ postData.author } readonly />
				      </div>
				    </div>
				    <div className={ updateStyles.row}>
				      <div>
				        <label className={ updateStyles.label} for="body">The story</label>
				      </div>
				      <div>
				        <textarea className={ updateStyles.textArea } id="body" name="body" placeholder="This story is about..." value={ postData.contentHtml } onChange={ handleChange } />
				      </div>
				    </div>
				    <div className={ updateStyles.row }>
				      <input className={ updateStyles.inputComponent } className={ updateStyles.submitButton } type="submit" value="Submit" />
				    </div>
				  </form>
				</div>
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

