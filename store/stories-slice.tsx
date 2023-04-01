import { createSelector, createSlice } from "@reduxjs/toolkit";
import { firebaseUrl } from "../components/hooks/httpFunctions";
import {
    compressedType,
    findDependentItems,
    getCompressedType,
    RootState,
    Selector,
} from "../store";
import { characterObjectsSelector } from "./characters-slice";

export interface storyFormat {
    name: string;
    characters: string[];
    timeline: string[];
}

const initialStoriesState = {
    storyObjects: {} as Record<string, storyFormat>,
    selectedStoryName: "All",
};

const storiesSlice = createSlice({
    name: "storiesSlice",
    initialState: initialStoriesState,
    reducers: {
        loadStories(state, action) {
            state.storyObjects = action.payload;
        },
        setSelectedStoryName(state, action) {
            state.selectedStoryName = action.payload;
        },
        addStory(state, action) {
            state.storyObjects[action.payload[0]] = {
                name: action.payload[1],
                characters: [],
                timeline: [],
            };
        },
        addCharacterToStory(state, action) {
            state.storyObjects[action.payload[1]].characters.push(
                action.payload[0]
            );
        },
        changeStoryName(state, action) {
            state.storyObjects[action.payload[0]].name = action.payload[1];
        },
        addTimeline(state, action) {
            state.storyObjects[action.payload[0]].timeline.push(
                action.payload[1]
            );
        },
        deleteTimeline(state, action) {
            const arrTimeline = state.storyObjects[action.payload[0]].timeline;
            arrTimeline.splice(arrTimeline.indexOf(action.payload[1]), 1);
        },
    },
});

// Selectors
export const storyObjectsSelector = (state: RootState) =>
    state.stories.storyObjects;
export const selectedStoryNameSelector = (state: RootState) =>
    state.stories.selectedStoryName;

export const storiesCharactersSortedSelector: Selector<compressedType[]> =
    createSelector(storyObjectsSelector, (storyObjects) => {
        const arrayObj = getCompressedType(storyObjects, "storiesCharacters");
        return arrayObj.sort((a, b) =>
            a.obj.name < b.obj.name ? -1 : a.obj.name > b.obj.name ? 1 : 0
        );
    });

export const storiesTimelineSortedSelector: Selector<compressedType[]> =
    createSelector(storyObjectsSelector, (storyObjects) => {
        const arrayObj = getCompressedType(storyObjects, "storiesTimeline");
        return arrayObj.sort((a, b) =>
            a.obj.name < b.obj.name ? -1 : a.obj.name > b.obj.name ? 1 : 0
        );
    });

export const charactersInStorySelector: Selector<compressedType[]> =
    createSelector(
        selectedStoryNameSelector,
        storiesCharactersSortedSelector,
        characterObjectsSelector,
        (storyName, stories, characterObjects) => {
            return findDependentItems(
                stories,
                characterObjects,
                storyName,
                "storiesCharacters"
            );
        }
    );

export const storySelectedObjectSelector: Selector<compressedType> =
    createSelector(
        selectedStoryNameSelector,
        storiesCharactersSortedSelector,
        (storyName, storyObjects) => {
            return storyObjects.find((story) => story.obj.name == storyName);
        }
    );

export const storySelectedObjectTimelineSelector: Selector<compressedType> =
    createSelector(
        selectedStoryNameSelector,
        storiesTimelineSortedSelector,
        (storyName, storyObjects) => {
            // if (storyName === "All") {
            //     return null
            // }
            return storyObjects.find((story) => story.obj.name == storyName);
        }
    );

const mappingStoryObj = (data: any) => {
    const mappedData = {} as Record<string, storyFormat>;
    Object.keys(data).map((id) => {
        const characters: string[] = Object.values(data[id].characters || {});
        const timelines: string[] = Object.values(data[id].timeline || {});
        mappedData[id] = {
            name: data[id].name,
            characters: characters,
            timeline: timelines,
        };
    });
    return mappedData;
};

// THUNKS
export const loadStories = () => {
    return async (dispatch) => {
        try {
            const response = await fetch(`${firebaseUrl}/stories.json`, {
                method: "GET",
                headers: {},
                body: null,
            });

            const data: any = await response.json();
            dispatch(storiesActions.loadStories(mappingStoryObj(data)));
        } catch (error) {
            console.error(error);
        }
    };
};

export const addNewStory = (storyName: string) => {
    return async (dispatch) => {
        try {
            const response = await fetch(`${firebaseUrl}/stories.json`, {
                method: "POST",
                body: JSON.stringify({ name: storyName }),
                headers: {},
            });

            const data: any = await response.json();
            dispatch(storiesActions.addStory([data.name, storyName]));
            return data.name;
        } catch (error) {
            console.error(error);
        }
    };
};

export const addCharacterToStory = (storyId: string, charId: string) => {
    return async (dispatch) => {
        try {
            const response = await fetch(
                `${firebaseUrl}/stories/${storyId}/characters.json`,
                {
                    method: "POST",
                    body: JSON.stringify(charId),
                    headers: {},
                }
            );

            const data: any = await response.json();
            dispatch(storiesActions.addCharacterToStory([charId, storyId]));
        } catch (error) {
            console.error(error);
        }
    };
};

export const addTimelineToStory = (storyId: string, timelineId: string) => {
    return async (dispatch) => {
        try {
            const response = await fetch(
                `${firebaseUrl}/stories/${storyId}/timeline.json`,
                {
                    method: "POST",
                    body: JSON.stringify(timelineId),
                    headers: {},
                }
            );

            const data: any = await response.json();
            dispatch(storiesActions.addTimeline([storyId, timelineId]));
        } catch (error) {
            console.error(error);
        }
    };
};

export const editStoryName = (storyId: string, newName: string) => {
    return async (dispatch) => {
        try {
            const response = await fetch(
                `${firebaseUrl}/stories/${storyId}/name.json`,
                {
                    method: "PUT",
                    body: JSON.stringify(newName),
                    headers: {},
                }
            );

            const data: any = await response.json();
            dispatch(storiesActions.changeStoryName([storyId, newName]));
            dispatch(storiesActions.setSelectedStoryName(newName));
        } catch (error) {
            console.error(error);
        }
    };
};

export const deleteTimelineFromStory = (
    storyId: string,
    timelineId: string
) => {
    return async (dispatch) => {
        try {
            const response = await fetch(
                `${firebaseUrl}/stories/${storyId}/timeline/${timelineId}.json`,
                {
                    method: "DELETE",
                    body: null,
                    headers: {},
                }
            );

            const data: any = await response.json();
            dispatch(storiesActions.deleteTimeline([storyId, timelineId]));
        } catch (error) {
            console.error(error);
        }
    };
};

export const getTimelinesFromStory = (storyId: string) => {
    return async (dispatch) => {
        try {
            const response = await fetch(
                `${firebaseUrl}/stories/${storyId}/timeline.json`,
                {
                    method: "GET",
                    body: null,
                    headers: {},
                }
            );

            const data: any = await response.json();
        } catch (error) {
            console.error(error);
        }
    };
};

export default storiesSlice.reducer;
export const storiesActions = storiesSlice.actions;
