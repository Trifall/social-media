import { GetServerSidePropsContext } from 'next';
import { getServerSession } from 'next-auth';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
import { authOptions } from './api/auth/[...nextauth]';

const SettingsPage = () => {
	// Render the page based on the session state
	const session = useSession();

	if (!session.data?.user) {
		return <div>You must be signed in to view this page</div>;
	}

	const user = session.data.user;

	return (
		<>
			<Head>
				<title>Settings | Social Media</title>
			</Head>
			<div className='py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6'>
				<div className='mx-auto max-w-screen-sm text-center'>
					<p className='mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white'>
						Welcome {user.name}!
					</p>
					<p className='mb-4 text-lg font-light text-gray-500 dark:text-gray-400'>SETTINGS</p>
					<Link
						href='/'
						className='inline-flex text-white bg-gray-600 hover:bg-gray-700 transition-all duration-500 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-primary-900 my-4 hover:underline'
					>
						Back to Homepage
					</Link>
				</div>
			</div>
		</>
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
	return { props: { session: session, isFixedFooter: true } };
}

export default SettingsPage;
