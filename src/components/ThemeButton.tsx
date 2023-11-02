'use client';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { BsFillMoonFill, BsFillSunFill } from 'react-icons/bs';

const ThemeButton = () => {
	const [isDark, setIsDark] = useState(false);

	const handleCheckboxChange = () => {
		setIsDark(!isDark);
	};

	const { systemTheme, theme, setTheme } = useTheme();
	const currentTheme = theme === 'system' ? systemTheme : theme;

	useEffect(() => {
		if (currentTheme === 'dark') {
			setIsDark(true);
		} else {
			setIsDark(false);
		}
	}, [currentTheme]);

	return (
		<label className='flex cursor-pointer select-none items-center gap-2 transition-all duration-500'>
			<BsFillSunFill />
			<div className='relative'>
				<input
					type='checkbox'
					checked={isDark}
					onChange={handleCheckboxChange}
					onClick={() => (theme == 'dark' ? setTheme('light') : setTheme('dark'))}
					className='sr-only'
				/>
				<div
					className={`box block h-8 w-14 rounded-full dark:bg-white bg-black transition-all duration-500 ${
						isDark ? 'bg-primary' : 'bg-dark'
					}`}
				></div>
				<div
					className={`absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-full dark:bg-black bg-white transition-all duration-500 ${
						isDark ? 'translate-x-full' : ''
					}`}
				></div>
			</div>
			<BsFillMoonFill />
		</label>
	);
};

export default ThemeButton;
