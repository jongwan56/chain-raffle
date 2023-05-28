import type { AppProps } from 'next/app';
import Header from '../components/header';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-grow bg-neutral-200 flex flex-col items-center">
        <Component {...pageProps} />
      </div>
    </div>
  );
}
