import { createSelector, createSlice } from "@reduxjs/toolkit";
import { RootState, Selector } from ".";
import { firebaseUrl } from "../components/hooks/httpFunctions";
import { storySelectedObjectTimelineSelector } from "./stories-slice";

export interface detailFormat {
    order: number;
    value: string;
}

export interface timelineFormat {
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

const initialTimelineState = {
    timelineObjects: {} as Record<string, timelineFormat>,
};

const timelineSlice = createSlice({
    name: "timelineSlice",
    initialState: initialTimelineState,
    reducers: {
        loadTimeline(state, action) {
            state.timelineObjects = action.payload;
        },
        addDetail(state, action) {
            state.timelineObjects[action.payload[0]].details[
                action.payload[1]
            ] = {
                order: action.payload[2],
                value: action.payload[3],
            };
        },
        addEvent(state, action) {
            const newDetails: Record<string, detailFormat> = {};
            newDetails[action.payload[1]] = {
                order: 0,
                value: "Write what happened in this event...",
            };

            state.timelineObjects[action.payload[0]] = {
                order: action.payload[2],
                event: action.payload[3],
                details: newDetails,
            };
        },
        modifyDetail(state, action) {
            state.timelineObjects[action.payload[0]].details[
                action.payload[1]
            ].value = action.payload[2];
        },
        modifyEvent(state, action) {
            state.timelineObjects[action.payload[0]].event = action.payload[1];
        },
        deleteDetail(state, action) {
            delete state.timelineObjects[action.payload[0]].details[
                action.payload[1]
            ];
        },
        deleteEvent(state, action) {
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
                return timeline.filter((t) =>
                    Array.from(story.obj.items).includes(t.id)
                );
            }
        }
    );

const mappingTimelineObj = (data: any) => {
    const mappedData = {} as Record<string, timelineFormat>;
    Object.keys(data).map((id) => {
        const mappedDetails = {} as Record<string, detailFormat>;
        const details: Record<string, detailFormat> = data[id].details;
        if (details !== undefined) {
            Object.keys(details).map((detailId) => {
                mappedDetails[detailId] = {
                    order: details[detailId].order,
                    value: details[detailId].value,
                };
            });
            mappedData[id] = {
                event: data[id].event,
                order: data[id].order,
                details: mappedDetails,
            };
        } else {
            mappedData[id] = {
                event: data[id].event,
                order: data[id].order,
                details: {},
            };
        }
    });
    return mappedData;
};

// THUNKS
export const loadTimeline = () => {
    return async (dispatch) => {
        try {
            const response = await fetch(`${firebaseUrl}/timeline.json`, {
                method: "GET",
                headers: {},
                body: null,
            });

            const data: any = await response.json();
            dispatch(timelineActions.loadTimeline(mappingTimelineObj(data)));
        } catch (error) {
            console.error(error);
        }
    };
};

export const addNewDetail = (
    timelineId: string,
    order: Number,
    value: string
) => {
    return async (dispatch) => {
        try {
            const response = await fetch(
                `${firebaseUrl}/timeline/${timelineId}/details.json`,
                {
                    method: "POST",
                    body: JSON.stringify({ order: order, value: value }),
                    headers: {},
                }
            );

            const data: any = await response.json();
            dispatch(
                timelineActions.addDetail([timelineId, data.name, order, value])
            );

            return data;
        } catch (error) {
            console.error(error);
        }
    };
};

export const addNewEvent = (order: Number, eventValue: string) => {
    const newDetailId = Math.floor(100000 + Math.random() * 900000).toString();
    const details = {};
    details[newDetailId] = {
        order: 0,
        value: "Write what happened in this event...",
    };
    return async (dispatch) => {
        try {
            const response = await fetch(`${firebaseUrl}/timeline.json`, {
                method: "POST",
                body: JSON.stringify({
                    order: order,
                    event: eventValue,
                    details: details,
                }),
                headers: {},
            });

            const data: any = await response.json();

            dispatch(
                timelineActions.addEvent([
                    data.name,
                    newDetailId,
                    order,
                    eventValue,
                ])
            );

            return data;
        } catch (error) {
            console.error(error);
        }
    };
};

export const editEvent = (timelineId: string, newValue: string) => {
    return async (dispatch) => {
        try {
            const response = await fetch(
                `${firebaseUrl}/timeline/${timelineId}/event.json`,
                {
                    method: "PUT",
                    body: JSON.stringify(newValue),
                    headers: {},
                }
            );

            const data: any = await response.json();
            dispatch(timelineActions.modifyEvent([timelineId, newValue]));
        } catch (error) {
            console.error(error);
        }
    };
};

export const deleteEvent = (timelineId: string) => {
    return async (dispatch) => {
        try {
            const response = await fetch(
                `${firebaseUrl}/timeline/${timelineId}.json`,
                {
                    method: "DELETE",
                    body: null,
                    headers: {},
                }
            );

            const data: any = await response.json();
            dispatch(timelineActions.deleteEvent(timelineId));
        } catch (error) {
            console.error(error);
        }
    };
};

export const editDetail = (
    timelineId: string,
    detailId: string,
    newValue: string
) => {
    return async (dispatch) => {
        try {
            const response = await fetch(
                `${firebaseUrl}/timeline/${timelineId}/details/${detailId}/value.json`,
                {
                    method: "PUT",
                    body: JSON.stringify(newValue),
                    headers: {},
                }
            );

            const data: any = await response.json();
            dispatch(
                timelineActions.modifyDetail([timelineId, detailId, newValue])
            );
        } catch (error) {
            console.error(error);
        }
    };
};

export const deleteDetail = (timelineId: string, detailId: string) => {
    return async (dispatch) => {
        try {
            const response = await fetch(
                `${firebaseUrl}/timeline/${timelineId}/details/${detailId}.json`,
                {
                    method: "DELETE",
                    body: null,
                    headers: {},
                }
            );

            const data: any = await response.json();
            dispatch(timelineActions.deleteDetail([timelineId, detailId]));
        } catch (error) {
            console.error(error);
        }
    };
};

export default timelineSlice.reducer;
export const timelineActions = timelineSlice.actions;
