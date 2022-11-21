import { Fragment, useEffect, useRef, useState } from "react";
import Portal from "../UI/Modals/Portal";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, compressedType } from "../../store";
import {
    categoriesActions,
    categoriesSortedSelector,
} from "../../store/categories-slice";
import {
    storiesActions,
    storiesCharactersSortedSelector,
} from "../../store/stories-slice";
import ContentBlocks from "./ContentBlocks";
import MainButton from "../UI/MainButton";
import { useRouter } from "next/router";
import styles from "./ContentBlocks.module.css";

const MainContentBlocksCategories = (props: {
    categorySelectedName: string;
}) => {
    // Router
    const router = useRouter();

    // Constants & Variables
    let componentDidMount = useRef(false);
    const categorySelectedName = decodeURIComponent(props.categorySelectedName);

    // State variables
    const [showEditModal, setShowEditModal] = useState(false);
    const [newStoryName, setNewStoryName] = useState("");
    const [showModalNewStory, setShowModalNewStory] = useState(false);

    //Selectors
    const allCategories = useSelector(categoriesSortedSelector);
    const allStories = useSelector(storiesCharactersSortedSelector);
    const storiesinCategoryObject = allCategories.map((category) => {
        const stories = allStories.filter((story) =>
            category.obj.items.includes(story.id)
        );
        return { categoryName: category.obj.name, stories: stories };
    });
    const categoryObject = allCategories.find(
        (category) => category.obj.name === categorySelectedName
    );

    // Dispatch
    const dispatch = useDispatch<AppDispatch>();

    // Handlers
    const addNewStoryHandler = (storyName: string) => {
        setNewStoryName(storyName);
        dispatch(storiesActions.addStory(storyName));
    };

    // UseEffect
    useEffect(() => {
        if (componentDidMount.current) {
            const newStoryId = allStories.find(
                (story) => story.obj.name === newStoryName
            ).id;
            dispatch(
                categoriesActions.addStoryToCategory([
                    newStoryId,
                    categoryObject.id,
                ])
            );

            setShowModalNewStory(false);
        }
        componentDidMount.current = true;
    }, [newStoryName]);

    // Content
    const categoriesToShow =
        categorySelectedName === "All"
            ? allCategories
            : allCategories.filter(
                  (category) => category.obj.name === categorySelectedName
              );

    return (
        <Fragment>
            <div>
                <div className={styles["btn-top"]}>
                    <MainButton
                        btn_type="blue"
                        onClickHandler={() => router.push("/stories/All")}
                    >
                        View All Stories
                    </MainButton>
                    <MainButton
                        btn_type="orange"
                        onClickHandler={() => setShowEditModal(true)}
                    >
                        Edit
                    </MainButton>
                </div>
                {categoriesToShow.map((category) => (
                    <ContentBlocks
                        key={category.id}
                        sectionTitle={category.obj.name}
                        blockItems={
                            storiesinCategoryObject.find(
                                (x) => x.categoryName === category.obj.name
                            ).stories
                        }
                        onClickNewHandler={() => setShowModalNewStory(true)}
                        onClickItemRef="/stories"
                    />
                ))}
            </div>

            {showEditModal && (
                <Portal
                    type="modalEditCategories"
                    title="Categories"
                    content={allCategories}
                    onOK={() => setShowEditModal(false)}
                    onClose={() => setShowEditModal(false)}
                />
            )}
            {showModalNewStory && (
                <Portal
                    type="modalNew"
                    title="New Story"
                    content={[]}
                    onOK={addNewStoryHandler}
                    onClose={() => setShowModalNewStory(false)}
                />
            )}
        </Fragment>
    );
};

export default MainContentBlocksCategories;
