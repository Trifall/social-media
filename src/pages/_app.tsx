import '@/styles/globals.css';
import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import Footer from '../components/Footer';
import Header from '../components/Header';

export default function App({
	Component,
	pageProps: { session, showHeader = true, showFooter = true, ...pageProps },
}: AppProps) {
	return (
		<SessionProvider session={session}>
			{showHeader && <Header />}
			<Component {...pageProps} />

			{showFooter && <Footer />}
		</SessionProvider>
	);
}
