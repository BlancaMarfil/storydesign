import { Fragment } from "react";
import MainButton from "../MainButton";
import styles from "./Portal.module.css";
import { propsTypes } from "./Portal";
import { useDispatch, useSelector } from "react-redux";
import {
    categoriesActions,
    categoriesSortedSelector,
} from "../../../store/categories-slice";
import { AppDispatch, compressedType } from "../../../store";
import EditableLabel from "../EditableLabel";
import { storiesActions } from "../../../store/stories-slice";

const ModalEditStories = (props: propsTypes) => {
    // Selectors
    const allCategories = useSelector(categoriesSortedSelector);

    // Dispatch
    const dispatch = useDispatch<AppDispatch>();

    //Functions
    const newStoryNameHandler = (newName: string) => {
        dispatch(
            storiesActions.changeStoryName([props.content[0], newName])
        );
        dispatch(storiesActions.setSelectedStoryName(newName));
    };

    const onCategoryClickedHandler = (categoryId: string) => {
        if (props.content[1].includes(categoryId)) {
            // Category deselected
            dispatch(
                categoriesActions.deleteStoryFromCategory([
                    props.content[0],
                    categoryId,
                ])
            );
        } else {
            // Category Selected
            dispatch(
                categoriesActions.addStoryToCategory([
                    props.content[0],
                    categoryId,
                ])
            );
        }
    };

    return (
        <Fragment>
            <div
                className={styles["modal-backdrop"]}
                onClick={props.onClose}
            ></div>
            <div className={`${styles["modal-box"]} ${styles["edit"]}`}>
                <div className={`${styles["div-modal"]} ${styles["edit"]}`}>
                    <EditableLabel
                        isLabel={true}
                        initValue={props.title}
                        onClickLabel={(value) => newStoryNameHandler(value)}
                        classNameLabel="modal-title"
                        classNameInput="modal-title-input-edit"
                    />
                    <div className={styles["div-modal-edit-stories"]}>
                        {allCategories.map((item: compressedType) => (
                            <div
                                key={item.id}
                                className={`${styles["div-edit-tag"]}  
                                ${
                                    props.content[1].includes(item.id) &&
                                    styles["found"]
                                }
                                `}
                                onClick={(event) =>
                                    onCategoryClickedHandler(item.id)
                                }
                            >
                                {item.obj.name}
                            </div>
                        ))}
                    </div>
                    <div className={styles["div-btn-modal"]}>
                        <MainButton
                            btn_type="cancel_red"
                            onClickHandler={props.onClose}
                        >
                            Cancel
                        </MainButton>
                        <MainButton
                            btn_type="green"
                            onClickHandler={props.onClose}
                        >
                            OK
                        </MainButton>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

// ADD THE NEW EDIT MODAL

export default ModalEditStories;
