import Button from '@components/Button';
import Modal from '@components/Modal';
import { Dialog } from '@headlessui/react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { GetServerSidePropsContext } from 'next';
import { getServerSession } from 'next-auth';
import { signOut, useSession } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
import router from 'next/router';
import { useState } from 'react';
import { AiFillWarning } from 'react-icons/ai';
import { authOptions } from './api/auth/[...nextauth]';

export type DeleteAccountPostData = {
	user_id: string;
};

const AccountPage = () => {
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const mutation = useMutation({
		mutationFn: (data: DeleteAccountPostData) => {
			return axios.post('/api/delete_account', data);
		},
		onSuccess: () => {
			console.log('Like comment mutation success');
		},
	});

	// Render the page based on the session state
	const session = useSession();

	if (!session.data?.user) {
		return <div>You must be signed in to view this page</div>;
	}

	const user = session.data.user;

	const handleClose = (e?: React.FormEvent) => {
		e?.preventDefault();
		setIsDeleteModalOpen(false);
	};

	const handleConfirmDelete = async (e?: React.FormEvent) => {
		e?.preventDefault();
		setIsDeleteModalOpen(false);

		// console.log('Like button clicked');
		if (!user || !user.id) {
			alert('Error: User is not logged in');
			return;
		}

		setIsLoading(true);

		// make a request to the api to add liked post to user
		const deleteAccountResponse = await mutation.mutateAsync({
			user_id: user?.id,
		} as DeleteAccountPostData);

		// console.log(`likePostResponse: ${JSON.stringify(likePostResponse, null, 2)}`);

		if (deleteAccountResponse.status === 200) {
			alert('Account deleted successfully');
			signOut({
				redirect: true,
				callbackUrl: '/',
			}),
				router.replace('/');
		} else {
			alert(
				`Error: Failed to delete account. Status code: ${deleteAccountResponse.status}, message: ${deleteAccountResponse.data?.message}`
			);
		}
		setIsLoading(false);
	};

	return (
		<>
			<Head>
				<title>Account | Social Media</title>
			</Head>
			<div className='py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6'>
				<div className='mx-auto max-w-screen-sm text-center flex flex-col'>
					<p className='mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white'>
						Welcome {user.name}!
					</p>
					<p className='mb-4 text-lg font-light text-gray-500 dark:text-gray-400'>
						You are signed in with the email <span className='font-bold'>{user.email}</span> via{' '}
						<span className='font-bold'>GitHub</span>
					</p>
					<div>
						<Button
							className='inline-flex text-white bg-red-500 hover:bg-red-400 w-36 justify-center flex-row gap-2 items-center transition-all duration-200 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-primary-900 my-4'
							onClick={() => setIsDeleteModalOpen(true)}
							isLoading={isLoading}
						>
							{isLoading ? `Deleting...` : `Delete Account`}
						</Button>
					</div>
					<div>
						<Link
							href='/'
							className='inline-flex text-black bg-neutral-300 dark:bg-primary-fg dark:text-white dark:hover:bg-secondary-hover dark:border-light-primary-bg hover:bg-secondary-hover border-secondary-bg border-2 w-36 rounded-lg justify-center items-center transition-all duration-200 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium text-sm px-5 py-2.5 text-center dark:focus:ring-primary-900 my-4'
						>
							Back to Home
						</Link>
					</div>
				</div>
			</div>
			<Modal isOpen={isDeleteModalOpen} closeModal={handleClose} shouldCloseOnOverlayClick>
				<Dialog.Panel className='w-full transform overflow-hidden rounded-2xl dark:bg-secondary-bg bg-light-secondary-bg p-6 text-left align-middle shadow-xl transition-all'>
					{!user ? (
						<div className='flex flex-col items-center gap-3'>
							<div className='p-2 rounded-full'>
								<AiFillWarning className='h-10 w-10 text-red-600' />
							</div>
							<Dialog.Title as='h3' className='text-xl font-medium leading-6 dark:text-white text-black'>
								You must be signed in to create a post.
							</Dialog.Title>
							<div>
								<Button
									onClick={handleClose}
									className={`text-black dark:text-white dark:hover:bg-tertiary-hover hover:bg-secondary-hover dark:border-tertiary-hover border-secondary-bg border-2 w-36 rounded-lg justify-center flex flex-row gap-2 items-center transition-all duration-200`}
								>
									Close
								</Button>
							</div>
						</div>
					) : (
						<div className='flex flex-col items-center gap-3'>
							<div className='p-2 rounded-full'>
								<AiFillWarning className='h-10 w-10 text-red-600' />
							</div>
							<Dialog.Title as='h3' className='text-lg font-medium leading-6 text-white text-center'>
								<span className='dark:text-white text-black'>
									Are you sure you want to <span className='text-red-500 font-bold'>delete</span> your account? This
									action is <span className='text-red-500 font-bold'>irreversible</span>.
								</span>
							</Dialog.Title>
							<div className='flex gap-2'>
								<Button
									onClick={handleConfirmDelete}
									className={`text-black dark:text-white bg-red-500 hover:bg-red-400 border-secondary-bg border-2 w-36 rounded-lg justify-center flex flex-row gap-2 items-center transition-all duration-200`}
								>
									Yes
								</Button>
								<Button
									onClick={handleClose}
									className={`text-black dark:text-white dark:hover:bg-tertiary-hover hover:bg-secondary-hover dark:border-tertiary-hover border-secondary-bg border-2 w-36 rounded-lg justify-center flex flex-row gap-2 items-center transition-all duration-200`}
								>
									No
								</Button>
							</div>
						</div>
					)}
				</Dialog.Panel>
			</Modal>
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

export default AccountPage;
