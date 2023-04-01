import { Fragment, useRef, useState } from "react";
import Portal from "../UI/Modals/Portal";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store";
import {
    addStoryToCategory,
    categoriesSortedSelector,
} from "../../store/categories-slice";
import {
    addNewStory,
    addTimelineToStory,
    storiesCharactersSortedSelector,
} from "../../store/stories-slice";
import ContentBlocks from "./ContentBlocks";
import MainButton from "../UI/MainButton";
import { useRouter } from "next/router";
import styles from "./ContentBlocks.module.css";
import { addNewEvent } from "../../store/timeline-slice";

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
    const [newStoryCategoryId, setNewStoryCategoryId] = useState("");
    const [showModalNewStory, setShowModalNewStory] = useState(false);

    //Selectors
    const allCategories = useSelector(categoriesSortedSelector);
    const allStories = useSelector(storiesCharactersSortedSelector);
    const storiesInCategoreyObject = allCategories.map((category) => {
        const stories = allStories.filter((story) =>
            category.obj.items.includes(story.id)
        );
        return { categoryName: category.obj.name, stories: stories };
    });

    // Dispatch
    const dispatch = useDispatch<AppDispatch>();

    // Functions

    const addNewStoryHandler = async (storyName: string) => {
        const storyId = await dispatch(addNewStory(storyName));
        await dispatch(addStoryToCategory(newStoryCategoryId, storyId));
        const eventData = await dispatch(addNewEvent(0, "Write the first thing that happened..."));
        await dispatch(addTimelineToStory(storyId, eventData.name));
        setShowModalNewStory(false);
    };

    const onClickNewBlockHandler = (categoryId: string) => {
        setNewStoryCategoryId(categoryId);
        setShowModalNewStory(true);
    };

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
                            storiesInCategoreyObject.find(
                                (x) => x.categoryName === category.obj.name
                            ).stories
                        }
                        onClickNewHandler={() =>
                            onClickNewBlockHandler(category.id)
                        }
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
