import Link from "next/link";
import { Fragment, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { MdOutlineExpandLess, MdOutlineExpandMore } from "react-icons/md";
import { compressedType } from "../../store";
import { compressedTypeCharacter } from "../../store/characters-slice";
import styles from "./ContentBlocks.module.css";

interface propsTypes {
    sectionTitle: string;
    blockItems: compressedType[];
    onClickNewHandler: () => void;
    onClickItemRef: string;
    showNew?: boolean;
}

function sortItems(isAscending: boolean, stArray: compressedType[]) {
    if (isAscending) {
        return stArray.sort((a, b) =>
            a.obj.name < b.obj.name ? -1 : a.obj.name > b.obj.name ? 1 : 0
        );
    }
    return stArray.sort((a, b) =>
        a.obj.name < b.obj.name ? 1 : a.obj.name > b.obj.name ? -1 : 0
    );
}

const ContentBlocks = (props: propsTypes) => {
    // State
    const [isAscending, setAscending] = useState(true);

    // Handlers
    const sortItemsButtonHandler = (ascending: boolean) => {
        setAscending(ascending);
    };

    // Content
    let sortedItems = sortItems(isAscending, props.blockItems);
    let showNew = props.showNew !== false ? true : false;

    return (
        <Fragment>
            <div>
                <div className={styles.section}>
                    <div className={styles["section-title-btns"]}>
                        <span className={styles["section-title"]}>
                            {props.sectionTitle}
                        </span>
                        <div className={styles["section-btns"]}>
                            <MdOutlineExpandMore
                                className={styles["btn-sort"]}
                                onClick={(event) =>
                                    sortItemsButtonHandler(true)
                                }
                            />
                            <MdOutlineExpandLess
                                className={styles["btn-sort"]}
                                onClick={(event) =>
                                    sortItemsButtonHandler(false)
                                }
                            />
                        </div>
                    </div>

                    <hr className={styles["hr"]} />

                    <div className={styles["blocks"]}>
                        {sortedItems.map((st) => (
                            <Link
                                key={st.id}
                                href={`${
                                    props.onClickItemRef
                                }/${encodeURIComponent(st.obj.name)}`}
                            >
                                <div className={styles["block-item"]}>
                                    <span>{st.obj.name}</span>
                                </div>
                            </Link>
                        ))}

                        {showNew && (
                            <div
                                className={`${styles["block-item"]} ${styles["new-item"]}`}
                                onClick={props.onClickNewHandler}
                            >
                                <span>
                                    <AiOutlinePlus />
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default ContentBlocks;
