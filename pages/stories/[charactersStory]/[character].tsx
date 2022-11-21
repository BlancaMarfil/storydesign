import { useRouter } from "next/router";
import { Fragment } from "react";
import { useDispatch } from "react-redux";
import CharacterContent from "../../../components/CharacterContent";
import SideMenuCharacters from "../../../components/side-menu/SideMenuCharacters";
import { AppDispatch } from "../../../store";
import { characterActions } from "../../../store/characters-slice";
import { storiesActions } from "../../../store/stories-slice";

const characterPage = () => {
    // Router
    const router = useRouter();
    const storySelectedName = router.query.charactersStory as string;
    const characterSelectedName = router.query.character as string;

    // Dispatch
    const dispatch = useDispatch<AppDispatch>();
    dispatch(storiesActions.setSelectedStoryName(storySelectedName));
    dispatch(characterActions.setSelectedCharacterName(characterSelectedName));

    return (
        <Fragment>
            {characterSelectedName && (
                <div className="content">
                    <SideMenuCharacters
                        storySelectedName={storySelectedName}
                        characterSelectedName={characterSelectedName}
                    />
                    <CharacterContent />
                </div>
            )}
        </Fragment>
    );
};

export default characterPage;
