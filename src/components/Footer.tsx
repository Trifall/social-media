import { Tooltip } from '@nextui-org/tooltip';
import Link from 'next/link';
import { AiFillGithub } from 'react-icons/ai';
import { CgProfile } from 'react-icons/cg';

const Footer = () => {
	return (
		<footer className='py-3 md:px-6 lg:px-8 border-t-2 border-gray-700 bottom-0 left-1/2 -translate-x-1/2 fixed'>
			<div className='mx-auto max-w-screen-xl text-center'>
				<ul className='flex flex-wrap justify-center items-center mb-2 gap-4 text-white'>
					<Tooltip content="Jerren's Website" placement='top'>
						<li className='rounded-md flex justify-center'>
							<Link href={'https://trifall.com'} passHref target='_blank'>
								<CgProfile className='m-auto h-5 w-5 cursor-pointer dark:text-pink-300 text-pink-500' />
							</Link>
						</li>
					</Tooltip>
					<Tooltip content="Jerren's GitHub" placement='top'>
						<li className='rounded-md flex justify-center'>
							<Link href={'https://github.com/Trifall'} passHref target='_blank' legacyBehavior>
								<a
									className='github-element'
									data-tooltip-id='my-tooltip'
									data-tooltip-content='Hello world!'
									data-tooltip-place='top'
								>
									<AiFillGithub className='m-auto h-5 w-5 cursor-pointer dark:text-pink-300 text-pink-500' />
								</a>
							</Link>
						</li>
					</Tooltip>
					<div className='border-l border-gray-400 h-6 mx-1'></div> {/* vertical line separator */}
					<Tooltip content="Dolan's Website" placement='top'>
						<li className='rounded-md flex justify-center '>
							<Link href={'https://dolan.dev'} passHref target='_blank'>
								<CgProfile className='m-auto h-5 w-5 cursor-pointer dark:text-cyan-300 text-cyan-600' />
							</Link>
						</li>
					</Tooltip>
					<Tooltip content="Dolan's GitHub" placement='top'>
						<li className='rounded-md flex justify-center'>
							<Link href={'https://github.com/dolanR'} passHref target='_blank'>
								<AiFillGithub className='m-auto h-5 w-5 cursor-pointer dark:text-cyan-300 text-cyan-600' />
							</Link>
						</li>
					</Tooltip>
				</ul>
				<div className='flex flex-wrap flex-col justify-center'>
					<span className='text-sm sm:text-center dark:text-gray-400 text-gray-800'>
						© {new Date().getFullYear()} by{' '}
						<Link
							href={'https://github.com/Trifall'}
							target='_blank'
							className='hover:underline dark:text-pink-300 text-pink-500'
						>
							Jerren Trifan
						</Link>{' '}
						and{' '}
						<Link
							href={'https://github.com/dolanR'}
							target='_blank'
							className='hover:underline dark:text-cyan-300 text-cyan-600'
						>
							Dolan Reynolds
						</Link>
						.{' '}
					</span>
					<span className='text-sm sm:text-center dark:text-gray-400 text-gray-800'> All Rights Reserved.</span>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
