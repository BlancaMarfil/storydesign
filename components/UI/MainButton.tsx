import styles from "./MainButton.module.css";

interface propsTypes {
    btn_type: string;
    onClickHandler: any;
    children?: React.ReactNode;
}

class ButtonType {
    div_btn_location: string;
    btn_color: string;
    btn_location: string;

    constructor(
        div_btn_location: string,
        btn_color: string,
        btn_location: string
    ) {
        this.div_btn_location = div_btn_location;
        this.btn_color = btn_color;
        this.btn_location = btn_location;
    }

    static RedSidenavButton = new ButtonType("div-btn-main-sidenav","btn-red","btn-main-sidenav");
    static OrangeButton = new ButtonType("","btn-orange","");
    static RedCancelButton = new ButtonType("","btn-red","");
    static GreenButton = new ButtonType("","btn-green","");
    static BlueButton = new ButtonType("","btn-blue", "");
}

const MainButton = (props: propsTypes) => {
    let buttonType: ButtonType;

    switch (props.btn_type) {
        case "red_sidenav":
            buttonType = ButtonType.RedSidenavButton;
            break;
        case "orange":
            buttonType = ButtonType.OrangeButton;
            break;
        case "cancel_red":
            buttonType = ButtonType.RedCancelButton;
            break;
        case "green":
            buttonType = ButtonType.GreenButton;
            break;
        case "blue":
            buttonType = ButtonType.BlueButton;
            break;
        default:
            buttonType = ButtonType.RedSidenavButton
    }

    return (
        <div className={`${styles["div-btn-main"]} ${styles[buttonType.div_btn_location]}`}>
            <button
                onClick={props.onClickHandler}
                className={`${styles["btn-main"]} ${styles[buttonType.btn_color]}
                            ${styles[buttonType.btn_location]}`}>
                {props.children}
            </button>
        </div>
    );
};

export default MainButton;
