import { Fragment, useRef } from "react";
import MainButton from "../MainButton";
import styles from "./Portal.module.css";
import { propsTypes } from "./Portal";

const ModalNew = (props: propsTypes) => {
    // Ref
    const inputRef = useRef<HTMLInputElement>();

    // Functions
    const buttonOKPressedHandler = () => {
        const newCategoryName = inputRef.current!.value;
        props.onOK(newCategoryName);
    };

    const onEnterPressedHandler = (
        event: React.KeyboardEvent<HTMLInputElement>
    ) => {
        if (event.code === "Enter") {
            const newCategoryName = inputRef.current!.value;
            props.onOK(newCategoryName);
        }
    };

    return (
        <Fragment>
            <div
                className={styles["modal-backdrop"]}
                onClick={props.onClose}
            ></div>
            <div className={styles["modal-box"]}>
                <div className={styles["div-modal"]}>
                    <div className={styles["modal-title"]}>
                        <h1>{props.title}</h1>
                    </div>
                    <input
                        type="text"
                        name="modal-new-category"
                        ref={inputRef}
                        onKeyPress={onEnterPressedHandler}
                        className={styles["modal-input"]}
                        autoFocus
                    />
                    <div className={styles["div-btn-modal"]}>
                        <MainButton
                            btn_type="cancel_red"
                            onClickHandler={props.onClose}
                        >
                            Cancel
                        </MainButton>
                        <MainButton
                            btn_type="green"
                            onClickHandler={buttonOKPressedHandler}
                        >
                            OK
                        </MainButton>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default ModalNew;
