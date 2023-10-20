import { GetServerSidePropsContext } from 'next';
import { getServerSession } from 'next-auth';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { authOptions } from './api/auth/[...nextauth]';

const ProtectedPage = () => {
	// Render the page based on the session state
	const session = useSession();

	if (!session.data?.user) {
		return <div>You must be signed in to view this page</div>;
	}

	const user = session.data.user;

	return (
		<div className='py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6'>
			<div className='mx-auto max-w-screen-sm text-center'>
				<p className='mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white'>
					Welcome {user.name}!
				</p>
				<p className='mb-4 text-lg font-light text-gray-500 dark:text-gray-400'>
					This is a page only accessible to signed in users.
				</p>
				<Link
					href='/'
					className='inline-flex text-white bg-primary-600 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-primary-900 my-4 hover:underline'
				>
					Back to Homepage
				</Link>
			</div>
		</div>
	);
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
	// const session = await getSession(context);
	const session = await getServerSession(context.req, context.res, authOptions);

	// If no user, redirect to login
	if (!session) {
		return {
			redirect: {
				destination: '/',
				permanent: false,
			},
		};
	}
	// console.log(`session: ${JSON.stringify(session, null, 2)}`);

	// If there is a user, return the current session
	return { props: { session: session } };
}

export default ProtectedPage;
