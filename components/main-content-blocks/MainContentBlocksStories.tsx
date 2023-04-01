import { useRouter } from "next/router";
import { Fragment, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, compressedType } from "../../store";
import { storyCategoriesSelector } from "../../store/categories-slice";
import {
    addNewCharacter,
    charactersSortedSelector,
} from "../../store/characters-slice";
import {
    addCharacterToStory,
    selectedStoryNameSelector,
    storiesCharactersSortedSelector,
    storySelectedObjectSelector,
} from "../../store/stories-slice";
import MainButton from "../UI/MainButton";
import Portal from "../UI/Modals/Portal";
import ContentBlocks from "./ContentBlocks";
import styles from "./ContentBlocks.module.css";

const MainContentBlocksStories = () => {
    // Router
    const router = useRouter();

    // Constants and variables
    let componentDidMount = useRef(false);

    // State
    const [newCharStoryId, setNewCharStoryId] = useState("");
    const [showModalNewCharacter, setShowModalNewCharacter] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    // Selectors
    const storySelectedName = useSelector(selectedStoryNameSelector);
    const storyObject = useSelector(storySelectedObjectSelector);
    const allCharacters = useSelector(charactersSortedSelector);
    const storyCategories = useSelector(storyCategoriesSelector);
    const allStories = useSelector(storiesCharactersSortedSelector);
    const charactersInStoryObject = allStories.map((story) => {
        const characters: compressedType[] = allCharacters
            .filter((character) =>
                Array.from(story.obj.items).includes(character.id)
            )
            .map((char) => {
                return { id: char.id, obj: { name: char.name, items: [] } };
            });
        return { storyName: story.obj.name, characters: characters };
    });

    // Dispatch
    const dispatch = useDispatch<AppDispatch>();

    // Handlers

    const addNewCharacterHandler = async (characterName: string) => {
        const charId = await dispatch(addNewCharacter(characterName));
        await dispatch(addCharacterToStory(newCharStoryId, charId))
        setShowModalNewCharacter(false);
    };

    const onClickNewBlockHandler = (storyId: string) => {
        setNewCharStoryId(storyId);
        setShowModalNewCharacter(true);
    };

    // Content
    const storiesToShow =
        storySelectedName === "All"
            ? allStories
            : allStories.filter(
                  (story) => story.obj.name === storySelectedName
              );

    return (
        <Fragment>
            <div>
                <div className={styles["btn-top"]}>
                    <MainButton
                        btn_type="blue"
                        onClickHandler={() => router.push("/categories")}
                    >
                        Back
                    </MainButton>
                    {storySelectedName !== "All" && (
                        <div className={styles["btns-right"]}>
                            <MainButton
                                btn_type="green"
                                onClickHandler={() =>
                                    router.push(
                                        `/timeline/${storySelectedName}`
                                    )
                                }
                            >
                                Timeline
                            </MainButton>
                            <MainButton
                                btn_type="orange"
                                onClickHandler={() => setShowEditModal(true)}
                            >
                                Edit
                            </MainButton>
                        </div>
                    )}
                </div>
                <div className={styles["div-categories"]}>
                    {storyCategories.map((category) => (
                        <div
                            key={category.id}
                            className={styles["category-tag"]}
                            onClick={(event) =>
                                router.push(`/categories/${category.obj.name}`)
                            }
                        >
                            {category.obj.name}
                        </div>
                    ))}
                </div>
                {storiesToShow.map((story) => (
                    <ContentBlocks
                        key={story.id}
                        sectionTitle={story.obj.name}
                        blockItems={
                            charactersInStoryObject.find(
                                (x) => x.storyName === story.obj.name
                            ).characters
                        }
                        onClickNewHandler={() =>
                            onClickNewBlockHandler(story.id)
                        }
                        onClickItemRef={`/stories/${story.obj.name}`}
                    />
                ))}
            </div>

            {showEditModal && (
                <Portal
                    type="modalEditStories"
                    title={storySelectedName}
                    content={[
                        storyObject.id,
                        storyCategories.map((category) => category.id),
                    ]}
                    onOK={() => setShowEditModal(false)}
                    onClose={() => setShowEditModal(false)}
                />
            )}
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

export default MainContentBlocksStories;
