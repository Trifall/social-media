import { Dialog } from '@headlessui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { AiOutlinePlusSquare } from 'react-icons/ai';
import { z } from 'zod';
import Button from './Button';
import Modal from './Modal';

const CreateCommentSchema = z.object({
	content: z
		.string()
		.min(1, { message: 'Content must be at least 1 character long.' })
		.max(500, { message: 'Content must be less than 500 characters long.' }),
});

type CreateCommentInputs = z.infer<typeof CreateCommentSchema>;

const CommentsModal = ({
	commentModalOpen: postModalOpen,
	setCommentModalOpen: setCommentModalOpen,
	post_id,
}: {
	commentModalOpen: boolean;
	setCommentModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
	post_id: number;
}) => {
	const [isComplete, setComplete] = useState(false);

	const router = useRouter();

	// react-query API mutation
	const mutation = useMutation({
		mutationFn: (data: CreateCommentInputs) => {
			return axios.post('/api/comment', data);
		},
		onSuccess: () => {
			setComplete(true);
		},
	});

	// form hook
	const {
		register,
		handleSubmit,
		// watch,
		formState: { errors, isDirty },
		reset,
	} = useForm<CreateCommentInputs>({
		resolver: zodResolver(CreateCommentSchema),
	});

	// auth hook
	const session = useSession();
	// get user object
	const user = session?.data?.user;

	// form submit handler
	const onSubmit: SubmitHandler<CreateCommentInputs> = async (data) => {
		if (!user) {
			alert(`You must be signed in to reply to a post.`);
			return;
		}

		// console.log(`onsubmit`);
		console.log(`initial formData ${JSON.stringify(data, null, 2)}`);
		console.log(`initial form errors: ${JSON.stringify(errors, null, 2)}`);

		const formData: CreateCommentInputs & { user_id: string; post_id: number } = {
			user_id: user.id,
			content: data.content,
			post_id: post_id,
		};

		// make api call
		const commentResponse = await mutation.mutateAsync(formData);
		console.log(`API commentResponse ${JSON.stringify(commentResponse, null, 2)}`);
		if (commentResponse.status === 200) {
			router.replace(router.asPath);
		}
		console.log(`Form submission process complete`);
	};

	const formReset = () => {
		// reset the form data
		reset();
		// set the state variables to default
		setComplete(false);
		// reset the mutation data
		mutation.reset();
	};

	// modal close handler
	const handleClose = (e?: React.FormEvent) => {
		e?.preventDefault();
		if (isDirty && !isComplete) {
			if (confirm('Are you sure you want to close? All unsaved changes will be lost.')) {
				setCommentModalOpen(false);
				formReset();
			}
		} else {
			setCommentModalOpen(false);
			formReset();
		}
	};

	return (
		<Modal isOpen={postModalOpen} closeModal={() => setCommentModalOpen(false)}>
			<Dialog.Panel className='w-full transform overflow-hidden rounded-2xl dark:bg-primary-fg bg-light-primary-fg dark:text-white text-black p-6 text-left align-middle shadow-xl transition-all'>
				{!user && (
					<div className='flex flex-col items-center gap-3'>
						<div className='p-2 rounded-full'>
							<AiOutlinePlusSquare className='h-6 w-6 text-teal-300' />
						</div>
						<Dialog.Title as='h3' className='text-xl font-medium leading-6 dark:text-white text-black'>
							You must be signed to reply to a post.
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
				)}

				{user && (
					<form>
						<div className='flex items-center'>
							<div className='pl-4 p-2 rounded-full'>
								<AiOutlinePlusSquare className='h-6 w-6 text-teal-300' />
							</div>
							<Dialog.Title as='h3' className='text-xl font-bold leading-6 dark:text-white text-primary-bg'>
								Reply to Post
							</Dialog.Title>
						</div>
						<div className='mt-2'>
							<p className='text-sm dark:text-light-secondary-bg text-secondary-bg px-4'>
								Fill out information for your reply.
							</p>
						</div>
						{/* <div className='w-full border-t border-gray-400 my-4' /> */}
						<div className='mt-4 flex flex-col gap-4'>
							<div className='px-4 gap-2 flex flex-col dark:bg-primary-fg bg-light-primary-fg rounded-lg'>
								<label className='font-medium dark:text-white text-black'>Reply Content</label>
								<textarea
									disabled={isComplete}
									maxLength={500}
									style={{ resize: 'none' }}
									className='h-96'
									{...register('content')}
								/>
							</div>
						</div>
						<div className='mt-4 flex flex-col gap-4'>
							<Button
								className='flex items-center shadow-sm justify-center gap-2 dark:border-white border-secondary-bg border hover:text-white hover:bg-secondary-hover dark:hover:bg-tertiary-hover transition-all duration-300'
								onClick={handleSubmit(onSubmit)}
								isLoading={(mutation.status === 'pending' || mutation.isPending) && !isComplete}
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

export default CommentsModal;
