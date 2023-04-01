import { useRouter } from "next/router";
import { Fragment, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../store";
import {
    addTimelineToStory,
    deleteTimelineFromStory,
    getTimelinesFromStory,
    selectedStoryNameSelector,
    storiesActions,
    storiesTimelineSortedSelector,
} from "../store/stories-slice";
import {
    addNewDetail,
    addNewEvent,
    deleteDetail,
    deleteEvent,
    editDetail,
    editEvent,
    timelineActions,
    timelineSortedSelector,
    timelineStorySelector,
} from "../store/timeline-slice";
import styles from "./CharacterContent.module.css";
import ContentBlocks from "./main-content-blocks/ContentBlocks";
import EditableLabel from "./UI/EditableLabel";
import IconEditableLabel from "./UI/IconEditableLabel";
import MainButton from "./UI/MainButton";

const TimelineContent = () => {
    // Router
    const router = useRouter();

    // Constants and variables
    let componentDidMount = useRef(false);
    let componentDidMountII = useRef(false);

    // State
    const [inputVisible, setInputVisible] = useState(true);
    const [labelIdClicked, setLabelIdClicked] = useState("");
    const [infoAdded, setInfoAdded] = useState({
        timelineEventId: "",
        previousOrder: 0,
    });
    const [isLabel, setIsLabel] = useState(true);
    const [newEvent, setNewEvent] = useState("");

    // Selectors
    const storySelectedName = useSelector(selectedStoryNameSelector);
    const timelinesFound = useSelector(timelineStorySelector);
    const allTimelines = useSelector(timelineSortedSelector);
    const allStories = useSelector(storiesTimelineSortedSelector);
    const storyFound = allStories.find(
        (story) => story.obj.name === storySelectedName
    );

    // Dispatch
    const dispatch = useDispatch<AppDispatch>();

    // Functions

    // ---------- Inputs

    const onClickAddInputHandler = (id: string) => {
        setInputVisible(true);
        setLabelIdClicked(id);
    };

    const onBlurHandler = (inputValue: string) => {
        if (inputValue === "") {
            setInputVisible(false);
            setLabelIdClicked("");
        }
    };

    // ---------- Add New Detail

    const addNewDetailHandler = async (
        timelineEventId: string,
        previousOrder: number,
        value: string
    ) => {
        await dispatch(addNewDetail(timelineEventId, previousOrder + 1, value));
        setInfoAdded({
            timelineEventId: timelineEventId,
            previousOrder: previousOrder,
        });
    };

    // ---------- Add New Event

    const addNewEventhandler = async (previousOrder: number, value: string) => {
        const eventData = await dispatch(addNewEvent(previousOrder + 1, value));
        await dispatch(addTimelineToStory(storyFound.id, eventData.name));
        setNewEvent(value);
        setIsLabel(false);
        setInputVisible(false);
    };

    // ---------- Modify Detail

    const dispatchEditDetail = (
        timelineEventId: string,
        detailId: string,
        detailData: any
    ) => {
        dispatch(
            timelineActions.modifyDetail([
                timelineEventId,
                detailId,
                detailData,
            ])
        );
    };

    const modifyDetailHandler = async (
        timelineEventId: string,
        detailId: string,
        newValue: string
    ) => {
        if (newValue !== "") {
            await dispatch(editDetail(timelineEventId, detailId, newValue));
        } else {
            await dispatch(deleteDetail(timelineEventId, detailId));
        }
    };

    // ---------- Modify Event

    const dispatchEditEvent = (timelineEventId: string, eventData: any) => {
        dispatch(timelineActions.modifyEvent([timelineEventId, eventData]));
    };

    const dispatchDeleteEvent = (timelineEventId: string) => {
        dispatch(timelineActions.deleteEvent(timelineEventId));
    };

    const dispatchDeleteTimelineFromStory = async (
        timelineEventId: string,
        storyData: any
    ) => {
        const timelineIdInStory = Object.keys(storyData).find(
            (key) => storyData[key] === timelineEventId
        );

        await dispatch(deleteEvent(timelineEventId));
        await dispatch(deleteTimelineFromStory(storyFound.id, timelineEventId));
    };

    const modifyEventHandler = async (
        timelineEventId: string,
        timelineEventOrder: Number,
        newValue: string
    ) => {
        if (newValue !== "") {
            await dispatch(editEvent(timelineEventId, newValue));
        } else if (timelineEventOrder == 0) {
            await dispatch(
                editEvent(
                    timelineEventId,
                    "Write the first event in your story..."
                )
            );
        } else {
            await dispatch(deleteEvent(timelineEventId));
            await dispatch(getTimelinesFromStory(storyFound.id));
        }
    };

    // Use Effect
    useEffect(() => {
        if (componentDidMount.current) {
            // Add new field
            const event = timelinesFound.find(
                (event) => event.id === infoAdded.timelineEventId
            );
            const detailId = event.details.find(
                (detail) => detail.order === infoAdded.previousOrder + 1
            ).id;
            setLabelIdClicked(detailId);
            setInputVisible(true);
        }
        componentDidMount.current = true;
    }, [infoAdded]);

    // useEffect(() => {
    //     if (componentDidMountII.current) {
    //         // Update stories when a new event is added
    //         const timelineEventId = allTimelines.find(
    //             (event) => event.event === newEvent
    //         ).id;
    //         dispatch(storiesActions.addTimeline(timelineEventId));
    //     }
    //     componentDidMountII.current = true;
    // }, [newEvent]);

    // Content
    const content = (
        <div style={{ margin: "20px" }}>
            <ContentBlocks
                sectionTitle="All Stories"
                blockItems={allStories}
                onClickNewHandler={null}
                onClickItemRef={`/timeline`}
                showNew={false}
            />
        </div>
    );

    return storySelectedName === "All" ? (
        content
    ) : (
        <Fragment>
            <div className={styles.section}>
                <div className={styles["btn-top"]}>
                    <MainButton
                        btn_type="blue"
                        onClickHandler={() =>
                            router.push(`/stories/${storySelectedName}`)
                        }
                    >
                        Back
                    </MainButton>
                </div>
                <div className={styles.section}>
                    <span className={styles["section-title"]}>
                        {storySelectedName}
                    </span>
                </div>

                <hr className={styles["hr"]} />

                <div className={styles["whole-content"]}>
                    {timelinesFound.map((timelineEvent) => (
                        <div
                            key={timelineEvent.id}
                            className={styles["whole-feature"]}
                        >
                            <IconEditableLabel
                                divStyle="functions-div-feature"
                                isLabel={true}
                                labelInitValue={timelineEvent.event}
                                onClickIcon={() =>
                                    onClickAddInputHandler(timelineEvent.id)
                                }
                                onClickLabel={(value) =>
                                    modifyEventHandler(
                                        timelineEvent.id,
                                        timelineEvent.order,
                                        value
                                    )
                                }
                                classNameLabel="label-edit main-label"
                                classNameInput="modal-input-edit main-label"
                                onBlurInput={(value) => onBlurHandler(value)}
                            />
                            {timelineEvent.details.map((detail) => (
                                <Fragment key={detail.id}>
                                    <IconEditableLabel
                                        divStyle="functions-div"
                                        isLabel={isLabel}
                                        labelInitValue={detail.value}
                                        onClickIcon={() =>
                                            onClickAddInputHandler(detail.id)
                                        }
                                        onClickLabel={(value) =>
                                            modifyDetailHandler(
                                                timelineEvent.id,
                                                detail.id,
                                                value
                                            )
                                        }
                                        classNameLabel="label-edit feature-detail-specific"
                                        classNameInput="modal-input-edit feature-detail-specific"
                                        onBlurInput={(value) =>
                                            onBlurHandler(value)
                                        }
                                    />
                                    {labelIdClicked == detail.id &&
                                        inputVisible && (
                                            <div
                                                className={
                                                    styles["functions-div"]
                                                }
                                            >
                                                <EditableLabel
                                                    isLabel={false}
                                                    initValue=""
                                                    onClickLabel={(value) =>
                                                        addNewDetailHandler(
                                                            timelineEvent.id,
                                                            detail.order,
                                                            value
                                                        )
                                                    }
                                                    classNameLabel="label-edit feature-detail-specific"
                                                    classNameInput="modal-input-edit feature-detail-specific"
                                                    onBlurInput={(value) =>
                                                        onBlurHandler(value)
                                                    }
                                                />
                                            </div>
                                        )}
                                </Fragment>
                            ))}
                            {labelIdClicked == timelineEvent.id &&
                                inputVisible && (
                                    <div className={styles["functions-div"]}>
                                        <EditableLabel
                                            isLabel={false}
                                            initValue=""
                                            onClickLabel={(value) =>
                                                addNewEventhandler(
                                                    timelineEvent.order,
                                                    value
                                                )
                                            }
                                            classNameLabel="label-edit main-label"
                                            classNameInput="modal-input-edit main-label"
                                            onBlurInput={(value) =>
                                                onBlurHandler(value)
                                            }
                                        />
                                    </div>
                                )}
                        </div>
                    ))}
                </div>
            </div>
        </Fragment>
    );
};

export default TimelineContent;
