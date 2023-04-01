import Link from "next/link";
import { Fragment } from "react";
import { compressedType } from "../../store";
import styles from "./SideMenu.module.css";

interface propsTypes {
    selectedItem: string;
    content: compressedType[];
    hrefPath: string;
}

const SideMenuContent = (props: propsTypes) => {
    return (
        <Fragment>
            {props.content.map((object) => (
                <Link
                    key={object.id}
                    href={`/${props.hrefPath}/${object.obj.name}`}
                >
                    <a
                        className={
                            object.obj.name === props.selectedItem
                                ? styles.active
                                : ""
                        }
                    >
                        {object.obj.name}
                    </a>
                </Link>
            ))}
        </Fragment>
    );
};

export default SideMenuContent;

// CONSTRUCT DYNAMIC SIDE MENU
