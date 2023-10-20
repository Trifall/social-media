import React, { Fragment, useState } from 'react';

import { SessionContextValue, signIn, signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { BsFillCaretDownFill } from 'react-icons/bs';
import { FaGithub, FaHome } from 'react-icons/fa';
import { IoMdKey } from 'react-icons/io';

import { Dialog, Popover, Transition } from '@headlessui/react';

import Button from './Button';
import Modal from './Modal';

const Header = () => {
	const [signInModalOpen, setSignInModalOpen] = useState(false);
	const { data, status } = useSession();

	return (
		<div className='h-16 flex items-center justify-center text-white'>
			<SignInModal signInModalOpen={signInModalOpen} setSignInModalOpen={setSignInModalOpen} />
			<div className='flex justify-between items-center w-full mx-2 sm:mx-4'>
				<div className='flex text-base font-medium gap-6 items-center'>
					<Link href='/' passHref>
						<FaHome className='h-8 w-8 cursor-pointer' />
					</Link>
					{navLinks.map(({ title, href, isProtected }) =>
						isProtected && status !== 'authenticated' ? null : (
							<Link key={href} href={href} className='hover:text-gray-500'>
								{title}
							</Link>
						)
					)}
				</div>
				<div className='flex gap-4'>
					{status !== 'loading' &&
						(status === 'authenticated' ? (
							<ProfilePopover data={data} />
						) : (
							<Button
								onClick={() => setSignInModalOpen(true)}
								className='bg-transparent border border-white text-white hover:bg-gray-900 transition-all duration-500'
							>
								Login
							</Button>
						))}
				</div>
			</div>
		</div>
	);
};

const ProfilePopover = ({ data }: { data: SessionContextValue['data'] }) => {
	if (!data) return null;
	return (
		<Popover className='relative'>
			{({ open }) => (
				<>
					<Popover.Button className='flex items-center gap-2 outline-none'>
						<div className='relative h-8 w-8'>
							<Image
								sizes='100%'
								className='rounded-full object-cover m-0'
								fill
								quality={100}
								alt='profile'
								src={data.user?.image ?? ''}
							/>
						</div>
						<div>
							<div className='font-semibold'>{data.user?.name}</div>
						</div>
						<BsFillCaretDownFill
							className={`${open ? 'rotate-180 transform' : 'rotate-0'} text-gray-400 transition-transform`}
						/>
					</Popover.Button>

					<Transition
						as={Fragment}
						enter='transition ease-out duration-200'
						enterFrom='opacity-0 translate-y-1'
						enterTo='opacity-100 translate-y-0'
						leave='transition ease-in duration-150'
						leaveFrom='opacity-100 translate-y-0'
						leaveTo='opacity-0 translate-y-1'
					>
						<Popover.Panel className='absolute right-0 mt-3 max-w-xs w-[200px] lg:max-w-3xl z-20 bg-gray-800 rounded-xl'>
							<div className='overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 p-2'>
								<div className='relative whitespace-nowrap flex gap-8  p-4 flex-col'>
									{profileLinks.map((item) =>
										item.href ? (
											<Link
												className='-m-3 flex items-center bg-gray-900 rounded-lg border-white border-2 px-4 py-2 transition duration-150 ease-in-out hover:bg-gray-500 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50 text-sm font-medium'
												key={item.name}
												href={item.href}
											>
												{item.name}
											</Link>
										) : (
											<button
												key={item.name}
												onClick={item.onClick as () => void}
												className='-m-3 flex items-center bg-gray-900 rounded-lg px-4 py-2 border-2 transition duration-150 ease-in-out hover:bg-gray-500 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50 text-sm font-medium'
											>
												<p className='text-sm text-white'>{item.name}</p>
											</button>
										)
									)}
								</div>
							</div>
						</Popover.Panel>
					</Transition>
				</>
			)}
		</Popover>
	);
};

const profileLinks = [
	{
		name: 'Settings',
		href: '/settings',
	},
	{
		name: 'Sign out',
		onClick: () =>
			signOut({
				redirect: true,
				callbackUrl: '/',
			}),
	},
];

const SignInModal = ({
	signInModalOpen,
	setSignInModalOpen,
}: {
	signInModalOpen: boolean;
	setSignInModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
	const handleSignIn = async (method: 'github') => {
		await signIn(method, {
			redirect: false,
		});
	};

	return (
		<Modal isOpen={signInModalOpen} closeModal={() => setSignInModalOpen(false)}>
			<Dialog.Panel className='w-full max-w-md transform overflow-hidden rounded-2xl bg-gray-900 p-6 text-left align-middle shadow-xl transition-all'>
				<div className='flex items-center gap-3'>
					<div className='p-2 border-2 border-white rounded-full'>
						<IoMdKey className='h-6 w-6 text-teal-300' />
					</div>
					<Dialog.Title as='h3' className='text-lg font-medium leading-6 text-white'>
						Sign in
					</Dialog.Title>
				</div>
				<div className='mt-2'>
					<p className='text-sm text-gray-200'>Sign in with GitHub below</p>
				</div>
				{/* <div className='w-full border-t border-gray-400 my-4' /> */}

				<div className='mt-4 flex flex-col gap-4'>
					<Button
						className='flex items-center shadow-sm justify-center gap-2 border-white border hover:text-white hover:bg-gray-800 transition-all duration-300'
						onClick={() => handleSignIn('github')}
					>
						<FaGithub className='h-5 w-5' />
						Login with Github
					</Button>
				</div>
			</Dialog.Panel>
		</Modal>
	);
};

const navLinks = [
	{
		title: 'Home',
		href: '/',
	},
	{
		title: 'Protected',
		href: '/protected',
		isProtected: true,
	},
];

export default Header;