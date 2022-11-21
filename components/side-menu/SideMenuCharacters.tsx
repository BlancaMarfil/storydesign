import { Fragment, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store";
import {
    characterActions,
    charactersSortedSelector,
} from "../../store/characters-slice";
import { charactersInStorySelector } from "../../store/stories-slice";
import MainButton from "../UI/MainButton";
import Portal from "../UI/Modals/Portal";
import styles from "./SideMenu.module.css";
import SideMenuContent from "./SideMenuContent";

const SideMenuCharacters = (props: {
    storySelectedName: string;
    characterSelectedName: string;
}) => {
    // Use State
    const [showModalNewCharacter, setShowModalNewCharacter] = useState(false);

    //Selectors
    const charactersInStory = useSelector(charactersInStorySelector);

    // Dispatch
    const dispatch = useDispatch<AppDispatch>();

    // Handlers
    const addNewCharacterHandler = (characterName: string) => {
        dispatch(characterActions.addCharacter(characterName));
        setShowModalNewCharacter(false);
    };

    return (
        <Fragment>
            <nav className={styles.sidenav}>
                <MainButton
                    btn_type="red_sidenav"
                    onClickHandler={() => setShowModalNewCharacter(true)}
                >
                    New
                </MainButton>
                <SideMenuContent
                    selectedItem={props.characterSelectedName}
                    content={charactersInStory}
                    hrefPath={`stories/${props.storySelectedName}`}
                />
            </nav>
            {showModalNewCharacter && (
                <Portal
                    type="modalNew"
                    title="New Character"
                    content={[]}
                    onOK={addNewCharacterHandler}
                    onClose={() => setShowModalNewCharacter(false)}
                />
            )}
        </Fragment>
    );
};

export default SideMenuCharacters;
