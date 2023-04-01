import Link from "next/link";
import { Fragment, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { AppDispatch } from "../../store";
import {
    addNewCategory,
    categoriesSortedSelector,
} from "../../store/categories-slice";
import MainButton from "../UI/MainButton";
import Portal from "../UI/Modals/Portal";
import styles from "./SideMenu.module.css";
import SideMenuContent from "./SideMenuContent";

const SideMenuCategories = (props: { categorySelectedName: string }) => {
    // Use State
    const [showModalNewCategory, setShowModalNewCategory] = useState(false);

    //Selectors
    const categories = useSelector(categoriesSortedSelector);

    // Dispatch
    const dispatch = useDispatch<AppDispatch>();

    // Handlers
    const addNewCategoryHandler = async (categoryName: string) => {
        await dispatch(addNewCategory(categoryName));
        setShowModalNewCategory(false);
    };

    return (
        <Fragment>
            <nav className={styles.sidenav}>
                <MainButton
                    btn_type="red_sidenav"
                    onClickHandler={() => setShowModalNewCategory(true)}
                >
                    New
                </MainButton>
                <Link key="All" href="/categories/All">
                    <a
                        className={
                            props.categorySelectedName === "All"
                                ? styles.active
                                : ""
                        }
                    >
                        All
                    </a>
                </Link>
                <SideMenuContent
                    selectedItem={props.categorySelectedName}
                    content={categories}
                    hrefPath="categories"
                />
            </nav>
            {showModalNewCategory && (
                <Portal
                    type="modalNew"
                    title="New Category"
                    content={[]}
                    onOK={addNewCategoryHandler}
                    onClose={() => setShowModalNewCategory(false)}
                />
            )}
        </Fragment>
    );
};

export default SideMenuCategories;
