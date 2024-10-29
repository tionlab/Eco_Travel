import '@/styles/globals.css';
// import ClickIndicator from '../components/ClickIndicator';

export default function App({ Component, pageProps }) {
    return (
        <div>
            <Component {...pageProps} />
            {/* <ClickIndicator /> */}
        </div>
    );
}
