import '@/styles/globals.css';
import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { ThemeProvider } from 'next-themes';

export default function App({
	Component,
	pageProps: { session, showHeader = true, showFooter = true, ...pageProps },
}: AppProps) {
	return (
		<ThemeProvider attribute='class'>
			<SessionProvider session={session}>
				{showHeader && <Header />}
				<Component {...pageProps} />

				{showFooter && <Footer />}
			</SessionProvider>
		</ThemeProvider>
	);
}
