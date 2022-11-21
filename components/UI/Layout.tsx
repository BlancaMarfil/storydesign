import React, { Fragment } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "./Layout.module.css";

const Layout = (props: { children: React.ReactNode }) => {
    const router = useRouter();

    // Styles
    let lineStyle: { left: string; width: string };
    if (router.pathname.includes("/categories/")) {
        lineStyle = { left: "10px", width: "115px" };
    } else if (router.pathname.includes("/stories/")) {
        lineStyle = { left: "150px", width: "77px" };
    } else if (router.pathname.includes("/timeline/")) {
        lineStyle = { left: "250px", width: "97px" };
    } else {
        lineStyle = { left: "10px", width: "115px" };
    }

    return (
        <Fragment>
            <nav className={styles.topnav}>
                <Link href="/categories">Categories</Link>
                <Link href="/stories">Stories</Link>
                <Link href="/timeline">Timeline</Link>
                <div
                    className={styles.line}
                    style={{ left: lineStyle.left, width: lineStyle.width }}
                ></div>
            </nav>
            {props.children}
        </Fragment>
    );
};

export default Layout;
