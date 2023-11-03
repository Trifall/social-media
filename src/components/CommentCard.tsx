import type { Comment, DeleteCommentData, LikePostData } from '@/types/types';
import { Dialog, Popover, Transition } from '@headlessui/react';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosResponse } from 'axios';
import { Session } from 'next-auth';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Fragment, useEffect, useState } from 'react';
import { AiFillWarning, AiOutlineUser } from 'react-icons/ai';
import { BsTrashFill } from 'react-icons/bs';
import { FiMoreHorizontal } from 'react-icons/fi';
import { IoMdCheckmark } from 'react-icons/io';
import Button from './Button';
import LikeButton from './LikeButton';
import Modal from './Modal';

type CommentCardProps = {
	comment: Comment;
	user?: Session['user'];
};

const CommentCard = ({ comment, user }: CommentCardProps) => {
	const [isLiked, setIsLiked] = useState(false);
	const [likesCount, setLikesCount] = useState(comment.likes ?? 0);
	// mutation loading state
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (!user) {
			return;
		}

		if (user?.liked_posts) {
			const likedPost = !!user?.liked_posts?.find((likedPost) => likedPost.post_id === comment.id);
			setIsLiked(likedPost);
		}

		// console.log(`user object: ${JSON.stringify(user, null, 2)}`);
	}, [comment.id, user, user?.liked_posts]);

	const mutation = useMutation({
		mutationFn: async (data: LikePostData) => {
			let res: AxiosResponse | undefined = undefined;
			try {
				res = await axios.post('/api/like_post', data);
			} catch (error) {
				console.log(`Like comment mutation error: ${error}`);
			}
			return res;
		},
		onSuccess: () => {
			console.log('Like comment mutation success');
		},
		onError: (error) => {
			console.log(`Like comment mutation error: ${error.cause} - ${error.message} - ${error.stack}`);
		},
	});

	const handleLikeButtonClicked = async () => {
		// console.log('Like button clicked');
		if (!user || !user.id) {
			alert('Error: User not logged in');
			return;
		}

		if (!comment.id) {
			alert('Error: Comment id not found');
			return;
		}

		setIsLoading(true);

		// make a request to the api to add liked post to user
		const likePostResponse = await mutation.mutateAsync({
			post_id: comment.id,
			user_id: user?.id,
			set_state: !isLiked,
			is_comment: true,
		} as LikePostData);

		// console.log(`likePostResponse: ${JSON.stringify(likePostResponse, null, 2)}`);

		if (likePostResponse && likePostResponse.status === 200) {
			// alert('Post liked/unliked successfully');
			setLikesCount(!isLiked ? likesCount + 1 : likesCount - 1);
			setIsLiked(!isLiked);
		} else {
			if (likePostResponse?.data?.message && likePostResponse.status) {
				alert(
					`Error: Failed to like/unlike Comment. Status code: ${likePostResponse.status}, message: ${likePostResponse.data?.message}`
				);
			} else {
				alert(`Error: Failed to like/unlike Comment. Unknown Error.`);
			}
		}

		setIsLoading(false);
	};
	const dateString = comment.created_at
		? new Date(comment.created_at).toLocaleTimeString('en-US', {
				year: 'numeric',
				month: 'short',
				day: 'numeric',
				weekday: 'long',
				hour: '2-digit',
				minute: '2-digit',
				timeZoneName: 'short',
		  })
		: 'N/A';

	return (
		<div
			key={comment.id}
			className='flex flex-col  gap-2 bg-inherit bg-neutral-200  dark:bg-neutral-800 p-4 rounded-xl min-w-[350px] max-w-[85%]'
		>
			<CommentPopover comment={comment} user={user} />
			<div className='flex flex-row gap-2'>
				<div className='relative h-8 w-8'>
					{comment.users?.profileImage ? (
						<Image
							sizes='100%'
							className='rounded-full object-cover m-0'
							fill
							quality={100}
							alt='profile'
							src={comment.users?.profileImage}
						/>
					) : (
						<AiOutlineUser className='h-8 w-8 p-0 m-0 rounded-full' />
					)}
				</div>
				<div className='max-w-[94%]'>
					<div className='flex flex-col gap-1'>
						<div className='flex flex-row items-center gap-2 justify-between'>
							<div className='font-bold'>{comment.users?.name ? comment.users?.name : 'Unknown User'}</div>
							<div className='text-gray-500'>{dateString}</div>
						</div>
						<div>{comment.content}</div>
					</div>
				</div>
			</div>
			<div className='flex flex-row gap-1'>
				<LikeButton
					key={comment.id}
					onClick={handleLikeButtonClicked}
					isDisabled={isLoading || mutation?.isPending}
					isLiked={isLiked}
				/>
				<span className='opacity-75 pt-1'>{likesCount > 0 ? likesCount : ''}</span>
			</div>
		</div>
	);
};

const CommentPopover = ({ comment, user }: { comment: Comment; user?: Session['user'] }) => {
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [isDeleteLoading, setIsDeleteLoading] = useState(false);
	const [isRequestComplete, setIsRequestComplete] = useState(false);

	const router = useRouter();

	const deleteMutation = useMutation({
		mutationFn: (data: DeleteCommentData) => {
			return axios.post('/api/delete_comment', data);
		},
		onSuccess: () => {
			console.log('Delete comment mutation success');
		},
	});

	const handleClose = async (e?: React.FormEvent) => {
		e?.preventDefault();
		// sleep for 250 ms to allow for animation to finish
		setIsDeleteModalOpen(false);
		await new Promise((r) => setTimeout(r, 250));
		if (isRequestComplete) {
			router.replace(router.asPath);
			setIsRequestComplete(false);
		}
		setIsDeleteLoading(false);
		deleteMutation.reset();
	};

	const handleConfirmDelete = async (e?: React.FormEvent) => {
		e?.preventDefault();

		if (!user || !user.id) {
			alert('Error: User is not logged in');
			return;
		}

		setIsDeleteLoading(true);

		// make a request to the api to add liked post to user
		const deleteCommentResponse = await deleteMutation.mutateAsync({
			user_id: user?.id,
			comment_id: comment.id,
		} as DeleteCommentData);

		if (deleteCommentResponse.status !== 200) {
			alert(
				`Error: Failed to delete comment. Status code: ${deleteCommentResponse.status}, message: ${deleteCommentResponse.data?.message}`
			);
		}
		setIsDeleteLoading(false);
		setIsRequestComplete(true);
	};

	if (!comment) return null;
	if (!user) return null;
	if (user.id !== comment.user_id) return null;

	return (
		<div className='relative'>
			<Popover className='absolute right-0 top-0 hover:bg-secondary-hover rounded-lg p-2 transition-all duration-500'>
				{() => (
					<>
						<Popover.Button className='flex items-center gap-2 outline-none text-black dark:text-white'>
							<div className='relative h-8 w-8'>
								<FiMoreHorizontal className='h-8 w-8 p-0 hover:fill-red-500' />
							</div>
						</Popover.Button>

						<Transition
							as={Fragment}
							enter='transition ease-out duration-200'
							enterFrom='opacity-0 translate-y-1'
							enterTo='opacity-100 translate-y-0'
							leave='transition ease-in duration-150'
							leaveFrom='opacity-100 translate-y-0'
							leaveTo='opacity-0 translate-y-1'
						>
							<Popover.Panel className='absolute right-0 mt-3 max-w-xs w-[200px] lg:max-w-3xl z-20 bg-primary-fg border-2 border-secondary-hover rounded-xl'>
								<div className='overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 p-2 '>
									<div className='relative whitespace-nowrap flex gap-8  p-4 flex-col'>
										<button
											onClick={() => setIsDeleteModalOpen(true)}
											className='-m-3 flex items-center rounded-lg px-4 py-2 transition duration-150 ease-in-out focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50 text-sm font-medium dark:hover:bg-tertiary-hover dark:bg-primary-fg hover:bg-tertiary-hover dark:text-white bg-primary-fg border-2 border-secondary-bg text-black'
										>
											<BsTrashFill className='h-5 w-5 text-white pr-2 fill-red-500' />
											<p className='text-sm text-red-500'>Delete Comment</p>
										</button>
									</div>
								</div>
							</Popover.Panel>
						</Transition>
					</>
				)}
			</Popover>
			<Modal
				isOpen={isDeleteModalOpen}
				closeModal={handleClose}
				shouldCloseOnOverlayClick={!isDeleteLoading}
				skipExitAnimation
			>
				<Dialog.Panel className='w-3/4 transform overflow-hidden rounded-2xl p-6 text-left align-middle shadow-xl transition-all dark:bg-secondary-bg bg-light-secondary-bg'>
					{!user ? (
						<div className='flex flex-col items-center gap-3'>
							<div className='p-2 rounded-full'>
								<AiFillWarning className='h-10 w-10 text-red-600' />
							</div>
							<Dialog.Title as='h3' className='text-xl font-medium leading-6 dark:text-white text-black'>
								You must be signed in to delete a comment.
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
								{isRequestComplete && deleteMutation.isSuccess ? (
									<IoMdCheckmark className='h-10 w-10 text-green-500' />
								) : (
									<AiFillWarning className='h-10 w-10 text-red-600' />
								)}
							</div>
							<Dialog.Title as='h3' className='text-lg font-medium leading-6 text-white text-center'>
								{isRequestComplete && deleteMutation.isSuccess ? (
									<span className='text-green-500 font-bold'>Comment deleted successfully!</span>
								) : deleteMutation.isError ? (
									<span className='text-red-500 font-bold'>
										Error:{' '}
										{deleteMutation.error?.message ? deleteMutation.error.message : `An unexpected error has occured.`}
									</span>
								) : (
									<span className='dark:text-white text-black'>
										Are you sure you want to <span className='text-red-500 font-bold'>delete</span> this comment? This
										action is <span className='text-red-500 font-bold'>irreversible</span>.
									</span>
								)}
							</Dialog.Title>
							<div className='flex gap-2'>
								<Button
									onClick={handleConfirmDelete}
									isDisabled={isDeleteLoading || isRequestComplete}
									isLoading={isDeleteLoading || deleteMutation.status === 'pending'}
									isSuccess={deleteMutation.status === 'success'}
									isError={deleteMutation.status === 'error'}
									className={`text-primary-fg bg-red-500 hover:bg-red-400 border-secondary-bg border-2 w-36 rounded-lg justify-center flex flex-row gap-2 items-center transition-all duration-200`}
								>
									{isDeleteLoading
										? 'Deleting...'
										: isRequestComplete && deleteMutation.status === 'success'
										? 'Deleted'
										: 'Yes'}
								</Button>
								<Button
									onClick={handleClose}
									isDisabled={isDeleteLoading || isRequestComplete}
									className={` text-black dark:text-white dark:hover:bg-tertiary-hover hover:bg-secondary-hover dark:border-tertiary-hover border-secondary-bg border-2 w-36 rounded-lg justify-center flex flex-row gap-2 items-center transition-all duration-200`}
								>
									No
								</Button>
							</div>
							{isRequestComplete ? (
								<Button
									onClick={handleClose}
									isDisabled={isDeleteLoading}
									className={`text-black dark:text-white dark:hover:bg-tertiary-hover hover:bg-secondary-hover dark:border-tertiary-hover border-secondary-bg border-2 w-36 rounded-lg justify-center flex flex-row gap-2 items-center transition-all duration-200`}
								>
									Close
								</Button>
							) : null}
						</div>
					)}
				</Dialog.Panel>
			</Modal>
		</div>
	);
};

export default CommentCard;
