import "../styles/globals.css";
import Layout from "../components/UI/Layout";
import { Fragment } from "react";
import Head from "next/head";
import { Provider } from "react-redux";
import store from "../store";

function MyApp({ Component, pageProps }) {
    return (
        <Fragment>
            <Provider store={store}>
                <Head>
                    <title>Story Design</title>
                </Head>
                <Layout>
                    <div id="modal-root"></div>
                    <Component {...pageProps} />
                </Layout>
            </Provider>
        </Fragment>
    );
}

export default MyApp;
