import { ReactNode } from 'react';
import { CgSpinner } from 'react-icons/cg';
import { IoMdCheckmarkCircle } from 'react-icons/io';
import { MdOutlineErrorOutline } from 'react-icons/md';

const Button = ({
	children,
	onClick,
	className,
	isLoading = false,
	isDisabled = false,
	isSuccess = false,
	isError = false,
}: {
	children: ReactNode;
	onClick?: () => void;
	className?: string;
	isLoading?: boolean;
	isDisabled?: boolean;
	isSuccess?: boolean;
	isError?: boolean;
}) => {
	const defaultButtonClass = className ?? 'text-white bg-transparent border border-white';

	return (
		<button
			disabled={isLoading || isDisabled || isSuccess || isError}
			onClick={onClick}
			className={`${
				isLoading || isDisabled || isSuccess || isError ? 'opacity-50' : ''
			} rounded-lg py-2.5 px-4 text-sm font-medium leading-5 ${defaultButtonClass}`}
		>
			<CgSpinner className={`animate-spin ${isLoading ? 'inline-block' : 'hidden'}`} />
			{(isSuccess || isError) && (
				<span className={`${isLoading ? 'ml-2' : ''} text-green-500`}>
					{isSuccess ? <IoMdCheckmarkCircle /> : isError ? <MdOutlineErrorOutline style={{ color: 'red' }} /> : ''}
				</span>
			)}
			{children}
		</button>
	);
};

export default Button;
