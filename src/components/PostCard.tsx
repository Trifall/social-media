import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { Session } from 'next-auth/core/types';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { HiOutlineChatBubbleOvalLeft } from 'react-icons/hi2';
import { LikePostData } from '../pages/api/like_post';
import { Post } from '../pages/api/post';
import LikeButton from './LikeButton';
import NoSSR from './NoSSR';

type PostCardProps = {
	post: Post;
	user?: Session['user'];
	onReplyClick?: () => void;
};

const PostCard = ({ post, user, onReplyClick }: PostCardProps) => {
	const [isLiked, setIsLiked] = useState(false);
	const [likesCount, setLikesCount] = useState(post.likes ?? 0);
	// mutation loading state
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (!user) {
			return;
		}

		if (user?.liked_posts) {
			const likedPost = !!user?.liked_posts?.find((likedPost) => likedPost.post_id === post.id);
			setIsLiked(likedPost);
		}

		// console.log(`user object: ${JSON.stringify(user, null, 2)}`);
	}, [post.id, user, user?.liked_posts]);

	const mutation = useMutation({
		mutationFn: (data: LikePostData) => {
			return axios.post('/api/like_post', data);
		},
		onSuccess: () => {
			console.log('Like post mutation success');
		},
	});

	if (!post) {
		return <div>Loading...</div>;
	}

	const handleLikeButtonClicked = async () => {
		// console.log('Like button clicked');
		if (!user || !user.id) {
			alert('Error: User not logged in');
			return;
		}

		if (!post.id) {
			alert('Error: Post id not found');
			return;
		}

		setIsLoading(true);

		// make a request to the api to add liked post to user
		const likePostResponse = await mutation.mutateAsync({
			post_id: post.id,
			user_id: user?.id,
			set_state: !isLiked,
		} as LikePostData);

		// console.log(`likePostResponse: ${JSON.stringify(likePostResponse, null, 2)}`);

		if (likePostResponse.status === 200) {
			// alert('Post liked/unliked successfully');
			setLikesCount(!isLiked ? likesCount + 1 : likesCount - 1);
			setIsLiked(!isLiked);
		} else {
			alert(
				`Error: Failed to like/unlike post. Status code: ${likePostResponse.status}, message: ${likePostResponse.data?.message}`
			);
		}
		setIsLoading(false);
	};

	const dateString = post.created_at
		? new Date(post.created_at).toLocaleTimeString('en-US', {
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
		<div className='flex flex-col rounded-lg bg-inherit bg-neutral-200 p-2 dark:bg-neutral-800'>
			<div className='flex items-center gap-5 px-3 pt-3'>
				<div className='relative h-12 w-12'>
					<Image
						sizes='100%'
						className='m-0 rounded-full object-cover'
						fill
						quality={100}
						alt='profile'
						src={post.users?.profileImage ?? ''}
					/>
				</div>
				<h1 className='text-xl font-bold text-black dark:text-white'>{post.users?.name}</h1>
			</div>
			<div className='px-3 pt-3'>{post.content}</div>
			<div className='flex flex-wrap justify-evenly gap-4 px-3 pt-3 relative'>
				{post.media?.map((media) => {
					return (
						<div
							key={media.id}
							className='max-w-md flex-auto rounded-lg border border-neutral-400 p-3 dark:border-neutral-50 relative'
						>
							<Image
								src={media.url}
								loading='lazy'
								alt='media'
								height={'0'}
								width={'0'}
								sizes='100%'
								className='relative rounded-lg'
								style={{ objectFit: 'contain', aspectRatio: '1/1', width: '100%', height: '100%' }}
							/>
						</div>
					);
				})}
			</div>
			<div className='flex flex-row flex-wrap justify-between px-2 pt-3'>
				<div className='flex flex-row gap-4 justify-center align-middle items-center'>
					<div className='flex flex-row gap-1'>
						{!onReplyClick ? (
							<Link
								key={post.id}
								href={'/post/' + post.id}
								className={'flex gap-2 rounded-lg transition-all duration-500 items-center'}
							>
								<HiOutlineChatBubbleOvalLeft className='h-8 w-8 p-0 hover:fill-blue-500' />
							</Link>
						) : (
							<button
								key={post.id}
								onClick={onReplyClick}
								className={'flex gap-2 rounded-lg transition-all duration-500 items-center'}
							>
								<HiOutlineChatBubbleOvalLeft className='h-8 w-8 p-0 hover:fill-red-500' />
							</button>
						)}
						<span className='opacity-75 pt-1'>
							{post?.comments && post.comments.length > 0 ? post.comments.length : ''}
						</span>
					</div>
					<div className='flex flex-row gap-1'>
						<LikeButton
							key={post.id}
							onClick={handleLikeButtonClicked}
							isDisabled={isLoading || mutation?.isPending}
							isLiked={isLiked}
						/>
						<span className='opacity-75 pt-1'>{likesCount > 0 ? likesCount : ''}</span>
					</div>
				</div>
				<NoSSR>
					<div className='px-3 items-center flex justify-center'>
						<span className=''>{dateString}</span>
					</div>
				</NoSSR>
			</div>
		</div>
	);
};

export default PostCard;
