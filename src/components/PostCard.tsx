import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { Session } from 'next-auth/core/types';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { HiOutlineChatBubbleOvalLeft } from 'react-icons/hi2';
import { LikePostData } from '../pages/api/like_post';
import { Post } from '../pages/api/post';
import LikeButton from './LikeButton';
import NoSSR from './NoSSR';

type PostCardProps = {
	post: Post;
	user?: Session['user'];
};

const PostCard = ({ post, user }: PostCardProps) => {
	const [isLiked, setIsLiked] = useState(false);
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
			<div className='flex flex-wrap justify-evenly gap-4 px-3 pt-3'>
				{post.media?.map((media) => {
					return (
						<img
							src={media.url}
							key={media.id}
							alt='media'
							className='max-w-sm flex-auto rounded-lg border border-neutral-400 object-contain p-3 dark:border-neutral-50'
						/>
					);
				})}
			</div>
			<div className='flex flex-row flex-wrap justify-between px-3 pt-3'>
				<div className='flex flex-row gap-2 justify-center align-middle items-center'>
					<button className='h-min w-min items-center rounded-lg bg-transparent p-0 align-middle text-black transition-all duration-500 dark:bg-transparent dark:text-white'>
						<HiOutlineChatBubbleOvalLeft className='h-8 w-8 p-0 hover:fill-blue-500' />
					</button>
					<LikeButton
						key={post.id}
						onClick={handleLikeButtonClicked}
						isDisabled={isLoading || mutation?.isPending}
						isLiked={isLiked}
					/>
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
