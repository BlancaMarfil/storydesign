import { Fragment, useRef } from "react";
import MainButton from "../MainButton";
import styles from "./Portal.module.css";
import { propsTypes } from "./Portal";

const ModalDelete = (props: propsTypes) => {

    return (
        <Fragment>
            <div
                className={styles["modal-backdrop-delete"]}
                onClick={props.onClose}
            ></div>
            <div className={`${styles["modal-box"]} ${styles.delete}`}>
                <div className={styles["div-modal"]}>
                    <div className={styles["modal-title"]}>
                        <h1>{props.title}</h1>
                        <p>
                            This action will delete the category, but not the stories inside.
                        </p>
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
                            onClickHandler={props.onOK}
                        >
                            OK
                        </MainButton>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default ModalDelete;
