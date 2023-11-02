import Button from '@components/Button';
import { GetServerSidePropsContext } from 'next';
import { getServerSession } from 'next-auth/next';
import { signIn, useSession } from 'next-auth/react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { FaGithub } from 'react-icons/fa';
import { IoMdKey } from 'react-icons/io';
import { authOptions } from './api/auth/[...nextauth]';

const Login = () => {
	const session = useSession();

	if (session.status === 'loading') {
		return <div>Loading...</div>;
	}

	if (session.data?.user) {
		return <div>You are already signed in.</div>;
	}

	const handleSignIn = async (method: 'github') => {
		await signIn(method, {
			redirect: true,
			callbackUrl: '/',
		});
	};

	return (
		<>
			<Head>
				<title>Login | Social Media</title>
			</Head>
			<div className='absolute w-full h-full bg-gray-600 blur-sm'>
				<Image src='/images/login_bg.jpeg' alt='' fill />
			</div>

			<div className='max-w-lg h-fit transform overflow-hidden rounded-2xl border-1 bg-opacity-75 bg-gray-900 px-6 py-4 text-left align-middle shadow-xl transition-all absolute bottom-0 left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2  '>
				<div className='flex gap-3 items-center'>
					<div className='p-2 border-2 border-white rounded-full'>
						<IoMdKey className='h-6 w-6 text-teal-300' />
					</div>
					<h3 className='text-lg font-medium text-center text-white'>Sign in</h3>
				</div>
				<div className='mt-4 flex flex-col justify-center items-center'>
					<Button
						className='text-white flex items-center shadow-sm justify-center gap-2 border-white border hover:text-white hover:bg-gray-800 transition-all duration-300'
						onClick={() => handleSignIn('github')}
					>
						<FaGithub className='h-5 w-5' />
						Login with Github
					</Button>
					<Link
						href='/'
						className='inline-flex text-white bg-transparent hover:bg-secondary-hover border-light-primary-bg border rounded-lg justify-center items-center transition-all duration-200 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium text-sm px-5 py-2 text-center dark:focus:ring-primary-900 my-4'
					>
						Back to Home
					</Link>
				</div>
			</div>
		</>
	);
};

export default Login;

export async function getServerSideProps(context: GetServerSidePropsContext) {
	// const session = await getSession(context);
	const session = await getServerSession(context.req, context.res, authOptions);

	// If no user, redirect to login
	if (session) {
		return {
			redirect: {
				destination: '/',
				permanent: false,
			},
		};
	}
	// console.log(`session: ${JSON.stringify(session, null, 2)}`);
	return {
		props: { session, showHeader: false, showFooter: true, isFixedFooter: true },
	};
}
