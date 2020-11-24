import Layout from '../../../components/layout';
import { getAllPostIds, getPostData } from '../../../lib/posts';
import { GetServerSideProps } from 'next';
import utilStyles from '../../../styles/utils.module.css';
import Head from 'next/head';
import updateStyles from './updateStyles.module.css';
import { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';



export default function Editor({ postData }) {

	// console.log('PostData is: ' + JSON.stringify(postData, null, 2));

	const [ titleInput, titleSetInput ] = useState(postData.title);
	const [ postInput, postSetInput ] = useState(postData.contentHtml);

	// Handle functions here...
	function updatePost(event) {
		event.preventDefault();

        // Update the post from DB
        console.log('User approved post update for id ' + postData.id);
        axios.post('/api/posts/update', {
        	id: postData.id,
        	title: titleInput,
        	post: postInput
        })
        .then(response => {
          Swal.fire({ icon: 'info',
                      title: 'Post updated!',
                      text: 'You can continue editing now if you want'});
        })
        .catch(error => {
          Swal.fire({ icon: 'error',
                      title: 'Oops...',
                      text: 'Could not update your post!'});
        });     

	}


	return (<Layout>
			<Head>
				<title>Post editor</title>
			</Head>
				<div className={ updateStyles.container }>
				  <form>
				    <div className={ updateStyles.row }>
				      <div>
				        <label className={ updateStyles.label} htmlFor="title">Title</label>
				      </div>
				      <div>
				        <input className={ updateStyles.inputComponent } type="text" id="title" name="title" placeholder="This story's title is..."  value={ titleInput } onChange={ e => titleSetInput(e.target.value) } />
				      </div>
				    </div>
				    <div className={ updateStyles.row}>
				      <div>
				        <label className={ updateStyles.label} htmlFor="author">Author</label>
				      </div>
				      <div>
				        <input className={ updateStyles.inputComponent } type="text" id="author" name="author" placeholder="This story's author is..." value={ postData.author } readOnly disabled />
				      </div>
				    </div>
				    <div className={ updateStyles.row}>
				      <div>
				        <label className={ updateStyles.label} htmlFor="body">The story</label>
				      </div>
				      <div>
				        <textarea className={ updateStyles.textArea } id="body" name="body" placeholder="This story is about..." value={ postInput } onChange={ e => postSetInput(e.target.value) } />
				      </div>
				    </div>
				    <div className={ updateStyles.row }>
				      <input className={ updateStyles.submitButton } type="submit" value="Update" onClick={ updatePost } />
				    </div>
				  </form>
				</div>
			</Layout>
	);

}


export const getServerSideProps: GetServerSideProps = async ({ params }) => {
	// Fetch necessary data for the blot post using params.id
	const postData = await getPostData(params.id as string);
	return {
		props: {
			postData
		}
	};
}

