import { createSelector, createSlice } from "@reduxjs/toolkit";
import { RootState, Selector } from ".";
import {
    storyObjectsSelector,
    storySelectedObjectTimelineSelector,
} from "./stories-slice";

interface detailFormat {
    order: number;
    value: string;
}

interface timelineFormat {
    event: string;
    order: number;
    details: Record<string, detailFormat>;
}

export interface compressedTypeTimeline {
    id: string;
    event: string;
    order: number;
    details: {
        id: string;
        order: number;
        value: string;
    }[];
}

const timeline: Record<string, timelineFormat> = {
    t1: {
        event: "Arriving at Vienna Train Station",
        order: 0,
        details: {
            d1: {
                order: 0,
                value: "The train was on time but her father was not there.",
            },
            d2: {
                order: 1,
                value: "They take a carraige and they get robbed.",
            },
        },
    },
    t2: {
        event: "Arriving at SommerSet Train Station",
        order: 1,
        details: {
            d3: {
                order: 0,
                value: "The train was on time but her mother was not there.",
            },
            d4: {
                order: 1,
                value: "They take a carraige and they start dancing",
            },
        },
    },
    t3: {
        event: "Leaving Tokyo Train Station",
        order: 2,
        details: {
            d5: {
                order: 0,
                value: "The train was NOT on time.",
            },
        },
    },
    t4: {
        event: "Getting Sandwiches",
        order: 3,
        details: {
            d6: {
                order: 0,
                value: "She doesn't like tomato",
            },
            d7: {
                order: 1,
                value: "He offers his cheese",
            },
            d8: {
                order: 3,
                value: "She refuses and leaves",
            },
        },
    },
};

const initialTimelineState = {
    timelineObjects: timeline,
};

const timelineSlice = createSlice({
    name: "timelineSlice",
    initialState: initialTimelineState,
    reducers: {
        addDetail(state, action) {
            // action.payload = [timelineEventId, detailOrder, detailValue]
            const event = state.timelineObjects[action.payload[0]];

            // Modify order of following details
            Object.keys(event.details).map((detailId) => {
                const detail = event.details[detailId];
                detail.order =
                    detail.order >= action.payload[1]
                        ? detail.order + 1
                        : detail.order;
            });

            const newDetailId = Math.random().toString();
            event.details[newDetailId] = {
                order: action.payload[1],
                value: action.payload[2],
            };
        },
        addEvent(state, action) {
            // action.payload = [eventOrder, eventValue]

            // Modify order of following attributes
            Object.keys(state.timelineObjects).map((eventId) => {
                const event = state.timelineObjects[eventId];
                event.order =
                    event.order >= action.payload[0]
                        ? event.order + 1
                        : event.order;
            });

            const newEventId = Math.random().toString();
            const newDetails: Record<string, detailFormat> = {
                newEventId: { order: 0, value: "New Detail" },
            };

            state.timelineObjects[newEventId] = {
                event: action.payload[1],
                order: action.payload[0],
                details: newDetails,
            };
        },
        modifyDetail(state, action) {
            // action.payload = [timelineEventId, detailId, newValue]
            const event = state.timelineObjects[action.payload[0]];
            event.details[action.payload[1]].value = action.payload[2];
        },
        modifyEvent(state, action) {
            // action.payload = [timelineEventId, newValue]
            state.timelineObjects[action.payload[0]].event = action.payload[1];
        },
        deleteDetail(state, action) {
            // action.payload = [timelineEventId, detailId]
            const event = state.timelineObjects[action.payload[0]];
            const deleteDetailOrder = event.details[action.payload[1]].order;
            delete event.details[action.payload[1]];

            // Rearrange orders
            Object.keys(event.details).map((detailId) => {
                const detail = event.details[detailId];
                detail.order =
                    detail.order > deleteDetailOrder
                        ? detail.order - 1
                        : detail.order;
            });
        },
        deleteEvent(state, action) {
            // action.payload = attributeId
            delete state.timelineObjects[action.payload];
        },
    },
});

// SELECTORS
export const timelineObjectsSelector = (state: RootState) =>
    state.timeline.timelineObjects;

export const timelineSortedSelector: Selector<compressedTypeTimeline[]> =
    createSelector(timelineObjectsSelector, (timelineObj) => {
        const timelineCompressed = Object.keys(timelineObj).map(
            (timelineId) => {
                const timeline = timelineObj[timelineId];
                const detailObjects = timeline.details;
                const detailsCompressed = Object.keys(detailObjects).map(
                    (detailId) => {
                        const detailInfo = detailObjects[detailId];
                        return {
                            id: detailId,
                            order: detailInfo.order,
                            value: detailInfo.value,
                        };
                    }
                );

                const detailsSorted = detailsCompressed.sort((a, b) =>
                    a.order < b.order ? -1 : a.order > b.order ? 1 : 0
                );

                return {
                    id: timelineId,
                    order: timeline.order,
                    event: timeline.event,
                    details: detailsSorted,
                };
            }
        );
        return timelineCompressed.sort((a, b) =>
            a.order < b.order ? -1 : a.order > b.order ? 1 : 0
        );
    });

export const timelineStorySelector: Selector<compressedTypeTimeline[]> =
    createSelector(
        timelineSortedSelector,
        storySelectedObjectTimelineSelector,
        (timeline, story) => {
            if (story) {
                return timeline.filter((t) => story.obj.items.includes(t.id));
            }
        }
    );

export default timelineSlice.reducer;
export const timelineActions = timelineSlice.actions;
