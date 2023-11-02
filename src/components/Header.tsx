import React, { Fragment, useState } from 'react';

import { SessionContextValue, signIn, signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { AiFillHome } from 'react-icons/ai';
import { BsFillCaretDownFill } from 'react-icons/bs';
import { FaGithub } from 'react-icons/fa';
import { IoMdKey } from 'react-icons/io';

import { Dialog, Popover, Transition } from '@headlessui/react';

import Button from './Button';
import Modal from './Modal';
import ThemeButton from './ThemeButton';

const Header = () => {
	const router = useRouter();
	const [signInModalOpen, setSignInModalOpen] = useState(false);
	const { data, status } = useSession();

	return (
		<div className='h-16 flex items-center justify-center dark:border-b-white border-b-black border-b-[1px] mb-4'>
			<SignInModal signInModalOpen={signInModalOpen} setSignInModalOpen={setSignInModalOpen} />
			<div className='flex justify-between items-center w-full mx-2 sm:mx-4'>
				<div className='flex text-base font-medium gap-2 items-center'>
					{navLinks.map(({ title, href, icon }) => (
						<Link
							key={href}
							href={href}
							className={
								router.pathname == href
									? 'flex gap-2 dark:hover:bg-secondary-hover dark:bg-secondary-bg  hover:bg-secondary-hover dark:text-white bg-light-primary-fg text-black px-4 py-3 lg:px-3 lg:py-2 rounded-lg transition-all duration-500 items-center'
									: 'flex gap-2 dark:hover:bg-secondary-hover  hover:bg-secondary-hover dark:text-white text-black px-4 py-3 lg:px-3 lg:py-2 rounded-lg transition-all duration-500 items-center'
							}
						>
							{icon}
							<span className='hidden lg:inline'>{title}</span>
						</Link>
					))}
				</div>
				<div className='flex gap-2'>
					<ThemeButton />
					{status !== 'loading' &&
						(status === 'authenticated' ? (
							<ProfilePopover data={data} />
						) : (
							<Button
								onClick={() => setSignInModalOpen(true)}
								className='dark:bg-primary-fg dark:text-white bg-light-primary-fg text-black dark:hover:bg-secondary-hover hover:bg-secondary-hover transition-all duration-500'
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
		<Popover className='relative hover:bg-secondary-hover rounded-lg p-2 transition-all duration-500'>
			{({ open }) => (
				<>
					<Popover.Button className='flex items-center gap-2 outline-none text-black dark:text-white'>
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
							className={`${
								open ? 'rotate-180 transform' : 'rotate-0'
							} dark:text-white text-primary-fg transition-transform`}
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
						<Popover.Panel className='absolute right-0 mt-3 max-w-xs w-[200px] lg:max-w-3xl z-20 bg-primary-fg rounded-xl'>
							<div className='overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 p-2'>
								<div className='relative whitespace-nowrap flex gap-8  p-4 flex-col'>
									{profileLinks.map((item) =>
										item.href ? (
											<Link
												className='-m-3 flex items-center text-white bg-primary-fg border-2 border-secondary-bg rounded-lg px-4 py-2 transition duration-150 ease-in-out dark:hover:bg-secondary-hover hover:bg-secondary-hover  focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50 text-sm font-medium'
												key={item.name}
												href={item.href}
											>
												{item.name}
											</Link>
										) : (
											<button
												key={item.name}
												onClick={item.onClick as () => void}
												className='-m-3 flex items-center bg-primary-fg border-2 border-secondary-bg rounded-lg px-4 py-2 transition duration-150 ease-in-out dark:hover:bg-secondary-hover hover:bg-secondary-hover focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50 text-sm font-medium'
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
		name: 'Account',
		href: '/account',
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
		<Modal isOpen={signInModalOpen} closeModal={() => setSignInModalOpen(false)} shouldCloseOnOverlayClick>
			<Dialog.Panel className='w-full max-w-md transform overflow-hidden rounded-2xl p-6 text-left align-middle shadow-xl transition-all dark:bg-secondary-bg bg-light-secondary-bg'>
				<div className='flex items-center gap-3'>
					<div className='p-2 border-2 dark:border-white border-secondary-bg rounded-full'>
						<IoMdKey className='h-6 w-6 text-teal-500' />
					</div>
					<Dialog.Title as='h3' className='text-xl font-medium leading-6 dark:text-white text-black'>
						Sign in
					</Dialog.Title>
				</div>
				<div className='mt-4 flex flex-col gap-4 justify-center items-center'>
					<Button
						className='flex flex-row items-center shadow-sm justify-center gap-2 text-black dark:text-white dark:hover:bg-tertiary-hover hover:bg-secondary-hover dark:border-tertiary-hover border-secondary-bg border-2 rounded-lg transition-all duration-200'
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
		icon: <AiFillHome className='h-5 w-5' />,
	},
];

export default Header;
