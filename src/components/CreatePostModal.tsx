import { Dialog } from '@headlessui/react';
import { AiOutlinePlusSquare } from 'react-icons/ai';
import Button from './Button';
import Modal from './Modal';
import { MultiUploader } from './UploadButton';

const CreatePostModal = ({
	createPostModalOpen,
	setCreatePostModalOpen,
}: {
	createPostModalOpen: boolean;
	setCreatePostModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
	const handleSubmit = async () => {
		// handle creation
	};

	return (
		<Modal isOpen={createPostModalOpen} closeModal={() => setCreatePostModalOpen(false)}>
			<Dialog.Panel className='w-full max-w-md transform overflow-hidden rounded-2xl bg-gray-700 p-6 text-left align-middle shadow-xl transition-all'>
				<div className='flex items-center gap-3'>
					<div className='p-2 rounded-full'>
						<AiOutlinePlusSquare className='h-6 w-6 text-teal-300' />
					</div>
					<Dialog.Title as='h3' className='text-lg font-medium leading-6 text-white'>
						Create Post
					</Dialog.Title>
				</div>
				<div className='mt-2'>
					<p className='text-sm text-gray-200'>Fill out information for your post.</p>
				</div>
				{/* <div className='w-full border-t border-gray-400 my-4' /> */}
				<div className='mt-4'>
					<MultiUploader />
				</div>

				<div className='mt-4 flex flex-col gap-4'>
					<Button
						className='flex items-center shadow-sm justify-center gap-2 border-white border hover:text-white hover:bg-gray-800 transition-all duration-300'
						onClick={() => handleSubmit()}
					>
						Submit
					</Button>
				</div>
			</Dialog.Panel>
		</Modal>
	);
};

export default CreatePostModal;
