import { Dialog } from '@headlessui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { AiOutlinePlusSquare } from 'react-icons/ai';
import { z } from 'zod';
import Button from './Button';
import Modal from './Modal';
import MultiUploader from './UploadBox';

const CreatePostSchema = z.object({
	content: z
		.string()
		.min(1, { message: 'Content must be at least 1 character long.' })
		.max(500, { message: 'Content must be less than 500 characters long.' }),
	media: z.array(z.any()).max(4, { message: 'You can only upload up to 4 files.' }).optional(),
});

type CreatePostInputs = z.infer<typeof CreatePostSchema>;

const CreatePostModal = ({
	createPostModalOpen,
	setCreatePostModalOpen,
}: {
	createPostModalOpen: boolean;
	setCreatePostModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
	const {
		register,
		handleSubmit,
		// watch,
		formState: { errors, isDirty },
		reset,
		control,
	} = useForm<CreatePostInputs>({
		resolver: zodResolver(CreatePostSchema),
	});

	const onSubmit: SubmitHandler<CreatePostInputs> = (data) => {
		console.log(`onsubmit`);
		console.log(`data ${JSON.stringify(data, null, 2)}`);
		console.log(`errors: ${JSON.stringify(errors, null, 2)}`);
	};

	const handleClose = (e: React.FormEvent) => {
		e.preventDefault();
		if (isDirty) {
			if (confirm('Are you sure you want to close? All unsaved changes will be lost.')) {
				setCreatePostModalOpen(false);
				reset();
			}
		} else {
			setCreatePostModalOpen(false);
			reset();
		}
	};

	return (
		<Modal isOpen={createPostModalOpen} closeModal={() => setCreatePostModalOpen(false)}>
			<Dialog.Panel className='w-full transform overflow-hidden rounded-2xl bg-gray-700 p-6 text-left align-middle shadow-xl transition-all'>
				<form>
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
					<div className='mt-4 flex flex-col gap-4'>
						<div className='px-4 py-2 flex flex-col bg-gray-800 rounded-lg'>
							<label>Post Content</label>
							<textarea maxLength={500} style={{ resize: 'none' }} className='h-96' {...register('content')} />
						</div>
						<Controller
							name='media'
							control={control}
							defaultValue={[]}
							render={({ field, fieldState }) => <MultiUploader {...field} {...fieldState} />}
						/>
					</div>

					<div className='mt-4 flex flex-col gap-4'>
						<Button
							className='flex items-center shadow-sm justify-center gap-2 border-white border hover:text-white hover:bg-gray-800 transition-all duration-300'
							onClick={handleSubmit(onSubmit)}
						>
							Submit
						</Button>
						<button onClick={handleClose}>Close</button>
					</div>
				</form>
			</Dialog.Panel>
		</Modal>
	);
};

export default CreatePostModal;
