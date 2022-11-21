import { Fragment, FunctionComponent } from "react";
import ReactDOM from "react-dom";
import ModalNew from "./ModalNew";
import ModalEdit from "./ModalEdit";
import { compressedType } from "../../../store";
import ModalDelete from "./ModalDelete";
import ModalEditStories from "./ModalEditStories";

export interface propsTypes {
    type: string;
    title: string;
    content: any;
    onOK: (item: string) => void;
    onClose: () => void;
    children?: React.ReactNode;
}

const Portal = (props: propsTypes) => {
    let modal: JSX.Element;
    switch (props.type) {
        case "modalNew":
            modal = (
                <ModalNew
                    type=""
                    title={props.title}
                    content={props.content}
                    onOK={props.onOK}
                    onClose={props.onClose}
                />
            );
            break;
        case "modalEditCategories":
            modal = (
                <ModalEdit
                    type=""
                    title={props.title}
                    content={props.content}
                    onOK={props.onOK}
                    onClose={props.onClose}
                />
            );
            break;
        case "modalEditStories":
            modal = (
                <ModalEditStories
                    type=""
                    title={props.title}
                    content={props.content}
                    onOK={props.onOK}
                    onClose={props.onClose}
                />
            );
            break;
        case "modalDelete":
            modal = (
                <ModalDelete
                    type=""
                    title={props.title}
                    content={props.content}
                    onOK={props.onOK}
                    onClose={props.onClose}
                />
            );
            break;
    }
    return (
        <Fragment>
            {ReactDOM.createPortal(
                modal,
                document.getElementById("modal-root")
            )}
        </Fragment>
    );
};

export default Portal;
