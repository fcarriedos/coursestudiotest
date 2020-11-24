import Layout from '../../components/layout';
import { Editor } from './update/[id]';
import { getAllPostIds, getPostData } from '../../lib/posts';
import utilStyles from '../../styles/utils.module.css';
import Head from 'next/head';
import updateStyles from './update/updateStyles.module.css';
import { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function Creator({ postData }) {

	// console.log('PostData is: ' + JSON.stringify(postData, null, 2));

	const [ titleInput, titleSetInput ] = useState('');
	const [ authorInput, postSetAuthor ] = useState('');
	const [ postInput, postSetInput ] = useState('');

	// Handle functions here...
	function createPost(event) {
		event.preventDefault();

		// TODO: Validation 
		if (!titleInput || !authorInput || !postInput) {	
			Swal.fire({ icon: 'info', title: 'Every story has to have some ' + (!titleInput ? 'title' : ((!authorInput ? 'author' : ' text '))) + '...' });
			return;
		}

        // Update the post from DB
        console.log('Saving the post ');
        axios.post('/api/posts/create', {
        	user: authorInput,
        	title: titleInput,
        	post: postInput
        })
        .then(response => {
          Swal.fire({ icon: 'info',
                      title: 'Post saved!',
                      text: 'Taking you home now...'})
          .then(afterOk => {
	   		  window.location.href = '/';
          });
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
				        <input className={ updateStyles.inputComponent } type="text" id="author" name="author" placeholder="This story's author is..." value={ authorInput } onChange={ e => postSetAuthor(e.target.value) } />
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
				      <input className={ updateStyles.submitButton } type="submit" value="Create" onClick={ createPost } />
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
	const postData = {};
	return {
		props: {
			postData
		}
	};
}

