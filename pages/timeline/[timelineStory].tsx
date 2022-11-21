import { useRouter } from "next/router";
import { Fragment } from "react";
import { useDispatch } from "react-redux";
import TimelineContent from "../../components/TimelineContent";
import { AppDispatch } from "../../store";
import { storiesActions } from "../../store/stories-slice";

const timelineStory = () => {
    // Router
    const router = useRouter();
    const story = router.query.timelineStory as string;

    const dispatch = useDispatch<AppDispatch>();
    dispatch(storiesActions.setSelectedStoryName(story));

    return (
        <Fragment>
            {story && (
                <div className="content-no-sidenav">
                    <TimelineContent />
                </div>
            )}
        </Fragment>
    );
}

export default timelineStory;