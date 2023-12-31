import { Media } from '@/types/types';
import { Dialog } from '@headlessui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useUploadThing } from '@utils/uploadthing';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { AiOutlinePlusSquare } from 'react-icons/ai';
import { UploadFileResponse } from 'uploadthing/client';
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
	const [isComplete, setComplete] = useState(false);
	const [isUploading, setIsUploading] = useState(false);

	// TODO: on upload error, cancel mutation, set error status on form

	const router = useRouter();

	// react-query API mutation
	const mutation = useMutation({
		mutationFn: (data: CreatePostInputs) => {
			return axios.post('/api/post', data);
		},
		onSuccess: () => {
			// Invalidate and refetch
			// queryClient.invalidateQueries({ queryKey: ['todos'] });
			setComplete(true);
			setIsUploading(false);
		},
	});

	// form hook
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

	// uploadthing hook
	const { startUpload, permittedFileInfo } = useUploadThing('imageUploader', {
		onClientUploadComplete: () => {
			// alert('onclientcomplete uploaded successfully!');
		},
		onUploadError: () => {
			alert('An error occurred while uploading!');
		},
		onUploadBegin: () => {
			// alert('onuploadbegin upload has begun');
		},
	});

	// auth hook
	const session = useSession();
	// get user object
	const user = session?.data?.user;

	// form submit handler
	const onSubmit: SubmitHandler<CreatePostInputs> = async (data) => {
		if (!user) {
			alert(`You must be signed in to create a post.`);
			return;
		}

		// console.log(`onsubmit`);
		console.log(`initial formData ${JSON.stringify(data, null, 2)}`);
		console.log(`initial form errors: ${JSON.stringify(errors, null, 2)}`);

		const formData: CreatePostInputs & { user_id: string } = {
			user_id: user.id,
			content: data.content,
		};

		if (data?.media && data?.media?.length > 0) {
			setIsUploading(true);
			console.log(`Starting file upload for ${data.media.length} files...`);
			const uploadFilesResponse: UploadFileResponse[] | undefined = await startUpload(data.media);
			if (uploadFilesResponse) {
				// console.log(`sub uploadFilesResponse ${JSON.stringify(uploadFilesResponse, null, 2)}`);
				// alert(`File upload complete`);

				const mediaURLs: Media[] = uploadFilesResponse.map((file) => ({
					id: file.key,
					url: file.url,
					name: file.name,
					size: file.size,
				}));

				// console.log(`sub mediaURLs ${JSON.stringify(mediaURLs, null, 2)}`);

				formData.media = mediaURLs;
			} else {
				alert(`File upload failed, please try again.`);
				return;
			}
			setIsUploading(false);
		}

		console.log(`post-upload formData ${JSON.stringify(formData, null, 2)}`);
		// make api call
		const postResponse = await mutation.mutateAsync(formData);
		console.log(`API postResponse ${JSON.stringify(postResponse, null, 2)}`);
		if (postResponse.status === 200) {
			router.replace(router.asPath);
		}
		console.log(`Form submission process complete`);
	};

	const formReset = () => {
		// reset the form data
		reset();
		// set the state variables to default
		setIsUploading(false);
		setComplete(false);
		// reset the mutation data
		mutation.reset();
	};

	// modal close handler
	const handleClose = (e?: React.FormEvent) => {
		e?.preventDefault();
		if (isDirty && !isComplete) {
			if (confirm('Are you sure you want to close? All unsaved changes will be lost.')) {
				setCreatePostModalOpen(false);
				formReset();
			}
		} else {
			setCreatePostModalOpen(false);
			formReset();
		}
	};

	return (
		<Modal isOpen={createPostModalOpen} closeModal={() => setCreatePostModalOpen(false)}>
			<Dialog.Panel className='w-4/5 transform overflow-hidden rounded-2xl dark:bg-primary-fg bg-light-primary-fg dark:text-white text-black p-6 text-left align-middle shadow-xl transition-all'>
				{!user && (
					<div className='flex flex-col items-center gap-3'>
						<div className='p-2 rounded-full'>
							<AiOutlinePlusSquare className='h-6 w-6 text-teal-300' />
						</div>
						<Dialog.Title as='h3' className='text-xl font-medium leading-6 dark:text-white text-black'>
							You must be signed in to create a post.
						</Dialog.Title>
						<div>
							<Button
								onClick={handleClose}
								className={`flex items-center shadow-sm justify-center gap-2 dark:border-white border-secondary-bg border hover:text-white hover:bg-secondary-hover dark:hover:bg-tertiary-hover transition-all duration-300`}
							>
								Close
							</Button>
						</div>
					</div>
				)}

				{user && (
					<form>
						<div className='flex items-center'>
							<div className='pl-4 p-2 rounded-full'>
								<AiOutlinePlusSquare className='h-6 w-6 text-teal-300' />
							</div>
							<Dialog.Title as='h3' className='text-xl font-bold leading-6 dark:text-white text-primary-bg'>
								Create Post
							</Dialog.Title>
						</div>
						<div className='mt-2'>
							<p className='text-sm dark:text-light-secondary-bg text-secondary-bg px-4'>
								Fill out information for your post.
							</p>
						</div>
						{/* <div className='w-full border-t border-gray-400 my-4' /> */}
						<div className='mt-4 flex flex-col gap-4'>
							<div className='px-4 gap-2 flex flex-col dark:bg-primary-fg bg-light-primary-fg rounded-lg'>
								<label className='font-medium dark:text-white text-black'>Post Content</label>
								<textarea
									disabled={isComplete || mutation.isSuccess || mutation.isPending || isUploading}
									maxLength={500}
									style={{ resize: 'none' }}
									className='h-48 p-2'
									{...register('content')}
								/>
							</div>
							<div className='px-4'>
								<Controller
									name='media'
									control={control}
									defaultValue={[]}
									render={({ field, fieldState }) => (
										<MultiUploader
											{...field}
											{...fieldState}
											permittedFileInfo={permittedFileInfo}
											disabled={isComplete || mutation.isSuccess || mutation.isPending || isUploading}
										/>
									)}
								/>
							</div>
						</div>

						<div className='mt-4 flex flex-col gap-4 w-32 m-auto'>
							<Button
								className='flex items-center shadow-sm justify-center gap-2 dark:border-white border-secondary-bg border hover:text-white hover:bg-secondary-hover dark:hover:bg-tertiary-hover transition-all duration-300'
								onClick={handleSubmit(onSubmit)}
								isLoading={(mutation.status === 'pending' || mutation.isPending || isUploading) && !isComplete}
								isSuccess={mutation.isSuccess && isComplete}
								isDisabled={isComplete || mutation.isSuccess || mutation.isPending}
							>
								{isComplete && mutation.isSuccess ? `Submitted` : `Submit`}
							</Button>
							<Button
								onClick={handleClose}
								className={`py-1 ${
									mutation.isSuccess ? `border-green-400 border-2 rounded-lg` : `dark:border-white border-secondary-bg`
								} flex items-center shadow-sm justify-center gap-2 border hover:text-white hover:bg-secondary-hover dark:hover:bg-tertiary-hover transition-all duration-300`}
							>
								Close
							</Button>
							{mutation.failureReason && <span className='text-red-400'>{mutation.failureReason.message}</span>}
						</div>
					</form>
				)}
			</Dialog.Panel>
		</Modal>
	);
};

export default CreatePostModal;
