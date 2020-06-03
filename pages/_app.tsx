import { AppProps } from 'next/app';
import Head from 'next/head';
import '../styles/index.css';

export default function App({ Component, pageProps }: AppProps) {
    return (
        <>
            <Head>
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@531&display=swap"
                    rel="stylesheet"
                />
            </Head>
            <div className="font-body">
                <Component {...pageProps} />
            </div>
        </>
    );
}
