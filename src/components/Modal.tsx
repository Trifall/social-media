import React, { Fragment } from 'react';

import { Dialog, Transition } from '@headlessui/react';

export default function Modal({
	isOpen,
	children,
	closeModal,
	shouldCloseOnOverlayClick = false,
	skipExitAnimation = false,
}: {
	isOpen: boolean;
	closeModal: () => void;
	children: React.ReactNode;
	shouldCloseOnOverlayClick?: boolean;
	skipExitAnimation?: boolean;
}) {
	return (
		<Transition show={isOpen} as={Fragment}>
			<Dialog as='div' className='relative z-10' onClose={() => (shouldCloseOnOverlayClick ? closeModal() : null)}>
				<Transition.Child
					as={Fragment}
					enter='ease-out duration-100'
					enterFrom='opacity-0'
					enterTo='opacity-100'
					leave={skipExitAnimation ? `` : `ease-in duration-200`}
					leaveFrom={skipExitAnimation ? `` : `opacity-100`}
					leaveTo={skipExitAnimation ? `` : `opacity-0`}
				>
					<div className='fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm' />
				</Transition.Child>

				<div className='fixed inset-0 overflow-y-auto'>
					<div className='flex min-h-full items-center justify-center p-4 text-center'>
						<Transition.Child
							as={Fragment}
							enter='ease-out duration-100'
							enterFrom='opacity-0 scale-95'
							enterTo='opacity-100 scale-100'
							leave={skipExitAnimation ? `` : `ease-in duration-200`}
							leaveFrom={skipExitAnimation ? `` : `opacity-100 scale-100`}
							leaveTo={skipExitAnimation ? `` : `opacity-0 scale-95`}
						>
							{children}
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition>
	);
}
