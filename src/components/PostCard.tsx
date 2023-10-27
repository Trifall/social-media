import Image from 'next/image';
import { HiOutlineChatBubbleOvalLeft, HiOutlineHeart } from 'react-icons/hi2';
import { Post } from '../pages/api/post';
import NoSSR from './NoSSR';

type PostCardProps = {
	post: Post;
};

const PostCard = ({ post }: PostCardProps) => {
	if (!post) {
		return <div>Loading...</div>;
	}

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
		<div key={post.id} className='flex flex-col rounded-lg bg-inherit bg-neutral-200 p-2 dark:bg-neutral-800'>
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
					<button className='h-min w-min justify-center flex items-center rounded-lg bg-transparent p-0 align-middle text-black transition-all duration-500 dark:bg-transparent dark:text-white'>
						<HiOutlineHeart className='h-8 w-8 p-0 hover:fill-red-500' />
					</button>
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
