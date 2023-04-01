import "../styles/globals.css";
import Layout from "../components/UI/Layout";
import { Fragment, useEffect } from "react";
import Head from "next/head";
import { Provider } from "react-redux";
import store from "../store";
import { loadCharacters } from "../store/characters-slice";
import { loadCategories } from "../store/categories-slice";
import { loadStories } from "../store/stories-slice";
import { loadTimeline } from "../store/timeline-slice";
import { useRouter } from "next/router";

function MyApp({ Component, pageProps }) {

    // Router
    const router = useRouter();
     
    // Dispatch
    const dispatch = store.dispatch

    const asyncLoadAll = async () => {
        await dispatch(loadCategories());
        await dispatch(loadStories());
        await dispatch(loadCharacters());
        await dispatch(loadTimeline());
    };

    useEffect(() => {
        //router.replace("/categories");
        asyncLoadAll();
    }, []);

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
