import { useRouter } from "next/router";
import { Fragment, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../store";
import {
    selectedStoryNameSelector,
    storiesActions,
    storiesTimelineSortedSelector,
} from "../store/stories-slice";
import {
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

    // Dispatch
    const dispatch = useDispatch<AppDispatch>();

    // Functions
    const onClickAddInputHandler = (id: string) => {
        setInputVisible(true);
        setLabelIdClicked(id);
        console.log(id);
    };

    const onBlurHandler = (inputValue: string) => {
        if (inputValue === "") {
            setInputVisible(false);
            setLabelIdClicked("");
        }
    };

    const addNewDetailHandler = (
        timelineEventId: string,
        previousOrder: number,
        value: string
    ) => {
        dispatch(
            timelineActions.addDetail([
                timelineEventId,
                previousOrder + 1,
                value,
            ])
        );

        setInfoAdded({
            timelineEventId: timelineEventId,
            previousOrder: previousOrder,
        });
    };

    const addNewEventhandler = (previousOrder: number, value: string) => {
        dispatch(timelineActions.addEvent([previousOrder + 1, value]));
        setNewEvent(value);
        setIsLabel(false);
        setInputVisible(false);
    };

    const modifyDetailHandler = (
        timelineEventId: string,
        detailId: string,
        newValue: string
    ) => {
        if (newValue !== "") {
            dispatch(
                timelineActions.modifyDetail([
                    timelineEventId,
                    detailId,
                    newValue,
                ])
            );
        } else {
            dispatch(timelineActions.deleteDetail([timelineEventId, detailId]));
        }
    };

    const modifyEventHandler = (timelineEventId: string, newValue: string) => {
        if (newValue !== "") {
            dispatch(timelineActions.modifyEvent([timelineEventId, newValue]));
        } else {
            dispatch(timelineActions.deleteEvent(timelineEventId));
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

    useEffect(() => {
        if (componentDidMountII.current) {
            // Update stories when a new event is added
            const timelineEventId = allTimelines.find(
                (event) => event.event === newEvent
            ).id;
            dispatch(storiesActions.addTimeline(timelineEventId));
        }
        componentDidMountII.current = true;
    }, [newEvent]);

    // Content
    const content = (
        <div style={{margin: "20px"}}>
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
                                    modifyEventHandler(timelineEvent.id, value)
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
