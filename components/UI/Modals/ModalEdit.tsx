import { Fragment, useEffect, useState } from "react";
import MainButton from "../MainButton";
import styles from "./Portal.module.css";
import { RiDeleteBin3Line } from "react-icons/ri";
import Portal, { propsTypes } from "./Portal";
import { useDispatch, useSelector } from "react-redux";
import {
    categoriesActions,
    categoriesSortedSelector,
} from "../../../store/categories-slice";
import { AppDispatch, compressedType } from "../../../store";
import EditableLabel from "../EditableLabel";
import { useRouter } from "next/router";

const ModalEdit = (props: propsTypes) => {
    // Router
    const router = useRouter();

    //State
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState({} as compressedType);

    // Dispatch
    const dispatch = useDispatch<AppDispatch>();

    //Functions
    const deleteButtonHandler = (itemToDelete: compressedType) => {
        setItemToDelete(itemToDelete);
        setShowDeleteModal(true);
    };

    const buttonOKDeletePressedHandler = () => {
        dispatch(categoriesActions.deleteCategory(itemToDelete.id));
        setShowDeleteModal(false);
        router.push("/categories/All");
    };

    const newCategoryNameHandler = (newName: string, id: string) => {
        dispatch(categoriesActions.changeCategoryName([id, newName]));
        router.push(`/categories/${encodeURIComponent(newName)}`)
    };

    return (
        <Fragment>
            <div
                className={styles["modal-backdrop"]}
                onClick={props.onClose}
            ></div>
            <div
                className={`${styles["modal-box"]} ${styles["edit"]} ${
                    showDeleteModal && styles["backdrop"]
                }`}
            >
                <div className={`${styles["div-modal"]} ${styles["edit"]}`}>
                    <div className={styles["modal-title"]}>
                        <h1>{props.title}</h1>
                    </div>
                    <div className={styles["div-modal-edit"]}>
                        {props.content.map((item: compressedType) => (
                            <div
                                key={item.id}
                                className={styles["div-edit-row"]}
                            >
                                <EditableLabel
                                    isLabel={true}
                                    initValue={item.obj.name}
                                    onClickLabel={(value) =>
                                        newCategoryNameHandler(value, item.id)
                                    }
                                    classNameLabel="label-edit"
                                    classNameInput="modal-input-edit"
                                />
                                <div
                                    className={styles["div-btn-delete"]}
                                    onClick={(event) =>
                                        deleteButtonHandler(item)
                                    }
                                >
                                    <RiDeleteBin3Line
                                        className={styles["btn-delete"]}
                                    />
                                </div>
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

            {showDeleteModal && (
                <Portal
                    type="modalDelete"
                    title={`Are you sure you want to delete ${itemToDelete.obj.name} from categories`}
                    content={[]}
                    onOK={buttonOKDeletePressedHandler}
                    onClose={() => setShowDeleteModal(false)}
                />
            )}
        </Fragment>
    );
};

// ADD THE NEW EDIT MODAL

export default ModalEdit;
