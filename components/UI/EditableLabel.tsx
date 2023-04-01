import { useEffect, useRef, useState } from "react";
import styles from "./EditableLabel.module.css";

interface labelPropsTypes {
    isLabel: boolean;
    initValue: string;
    onClickLabel: (value: string) => void;
    classNameLabel: string;
    classNameInput: string;
    onBlurInput?: (value: string) => void;
}

const EditableLabel = (props: labelPropsTypes) => {
    // State
    const [isLabelClicked, setIsLabelClicked] = useState(false);

    // Ref
    const inputRef = useRef<HTMLTextAreaElement>();

    // Functions
    const labelClickedHandler = () => {
        setIsLabelClicked(true);
    };

    const onFocusTextareaHandler = (event: any) => {
        event.currentTarget.select();
        //event.currentTarget.style.height = 'inherit'
        event.currentTarget.style.height = `${event.currentTarget.scrollHeight}px`;
    };

    const onEnterPressedHandler = (
        event: React.KeyboardEvent<HTMLTextAreaElement>
    ) => {
        //event.currentTarget.style.height = 'inherit'
        event.currentTarget.style.height = `${event.currentTarget.scrollHeight}px`;
        if (event.code === "Enter") {
            props.onClickLabel(inputRef.current!.value);
            setIsLabelClicked(false);
        }
    };

    const onBlurHandler = () => {
        props.onBlurInput(inputRef.current!.value);
        setIsLabelClicked(false);
    };

    // UseEffect
    useEffect(() => {
        if (!props.isLabel) {
            setIsLabelClicked(true);
        }
    }, []);

    // Content
    const contentLabel = (
        <label
            className={props.classNameLabel
                .split(" ")
                .map((sty) => styles[sty])
                .join(" ")}
            onClick={labelClickedHandler}
        >
            {props.initValue}
        </label>
    );

    const contentInput = (
        <textarea
            name="modal-edit-input"
            defaultValue={props.initValue}
            onKeyPress={onEnterPressedHandler}
            ref={inputRef}
            onBlur={onBlurHandler}
            className={props.classNameInput
                .split(" ")
                .map((sty) => styles[sty])
                .join(" ")}
            autoFocus
            onFocus={onFocusTextareaHandler}
        />
    );

    return isLabelClicked ? contentInput : contentLabel;
};

export default EditableLabel;
