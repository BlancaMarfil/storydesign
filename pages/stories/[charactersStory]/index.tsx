import { useRouter } from "next/router";
import { Fragment } from "react";
import { useDispatch } from "react-redux";
import MainContentBlocksStories from "../../../components/main-content-blocks/MainContentBlocksStories";
import { AppDispatch } from "../../../store";
import { storiesActions } from "../../../store/stories-slice";

const charactersStoryPage = () => {
    // Router
    const router = useRouter();
    const storySelectedName = router.query.charactersStory as string;

    // Dispatch
    const dispatch = useDispatch<AppDispatch>();
    dispatch(storiesActions.setSelectedStoryName(storySelectedName));

    return (
        <Fragment>{storySelectedName && <MainContentBlocksStories />}</Fragment>
    );
};

export default charactersStoryPage;
