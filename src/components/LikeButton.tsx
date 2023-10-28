import { HiOutlineHeart } from 'react-icons/hi2';

type LikeButtonProps = {
	onClick: () => void;
	isLiked: boolean;
	isDisabled?: boolean;
};

const LikeButton = ({ onClick, isLiked, isDisabled = true }: LikeButtonProps) => {
	return (
		<button
			onClick={onClick}
			disabled={isDisabled}
			className={`h-min w-min justify-center flex items-center rounded-lg bg-transparent p-0 align-middle text-black transition-all duration-500 dark:bg-transparent dark:text-white  ${
				isDisabled ? `cursor-progress opacity-50` : `cursor-pointer opacity-100`
			}`}
		>
			<HiOutlineHeart
				className={`h-8 w-8 p-0 ${isLiked ? `hover:fill-gray-400 fill-red-500` : `hover:fill-red-500`}`}
			/>
		</button>
	);
};

export default LikeButton;
