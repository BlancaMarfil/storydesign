import { IoIosAddCircleOutline } from "react-icons/io";
import EditableLabel from "./EditableLabel";
import styles from "../CharacterContent.module.css";

interface propsTypes {
    divStyle: string;
    isLabel: boolean;
    labelInitValue: string;
    onClickIcon: () => void;
    onClickLabel: (value: string) => void;
    classNameLabel: string;
    classNameInput: string;
    onBlurInput: (value: string) => void;
}

const IconEditableLabel = (props: propsTypes) => {
    return (
        <div className={styles[props.divStyle]}>
            <IoIosAddCircleOutline
                className={styles["add-icon"]}
                onClick={props.onClickIcon}
            />
            <EditableLabel
                isLabel={props.isLabel}
                initValue={props.labelInitValue}
                onClickLabel={(value) => props.onClickLabel(value)}
                classNameLabel={props.classNameLabel}
                classNameInput={props.classNameInput}
                onBlurInput={props.onBlurInput}
            />
        </div>
    );
};

export default IconEditableLabel;
