import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { Session } from 'next-auth';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { LikePostData } from '../pages/api/like_post';
import { Comment } from '../pages/api/post';
import LikeButton from './LikeButton';

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
		mutationFn: (data: LikePostData) => {
			return axios.post('/api/like_post', data);
		},
		onSuccess: () => {
			console.log('Like comment mutation success');
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

		if (likePostResponse.status === 200) {
			// alert('Post liked/unliked successfully');
			setLikesCount(!isLiked ? likesCount + 1 : likesCount - 1);
			setIsLiked(!isLiked);
		} else {
			alert(
				`Error: Failed to like/unlike Comment. Status code: ${likePostResponse.status}, message: ${likePostResponse.data?.message}`
			);
		}
		setIsLoading(false);
	};

	return (
		<div key={comment.id} className='flex flex-col gap-2 bg-gray-800 p-4 rounded-xl'>
			<div className='flex flex-row gap-2'>
				<div className='relative h-8 w-8'>
					<Image
						sizes='100%'
						className='rounded-full object-cover m-0'
						fill
						quality={100}
						alt='profile'
						src={comment.users?.profileImage ?? ''}
					/>
				</div>
				<div>
					<div className='flex flex-col gap-1'>
						<div className='flex flex-row items-center gap-2'>
							<div className='font-bold'>{comment.users?.name}</div>
							<div className='text-gray-500'>{comment.created_at}</div>
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

export default CommentCard;
