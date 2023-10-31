import '@/styles/globals.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import type { AppProps } from 'next/app';
import Footer from '../components/Footer';
import Header from '../components/Header';

const queryClient = new QueryClient();

export default function App({
	Component,
	pageProps: { session, showHeader = true, showFooter = true, isFixedFooter = false, ...pageProps },
}: AppProps) {
	return (
		<ThemeProvider attribute='class'>
			<SessionProvider session={session}>
				<QueryClientProvider client={queryClient}>
					{showHeader && <Header />}
					<Component {...pageProps} />

					{showFooter && <Footer isFixed={isFixedFooter} />}
				</QueryClientProvider>
			</SessionProvider>
		</ThemeProvider>
	);
}
