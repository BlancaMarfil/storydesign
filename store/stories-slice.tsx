import { createSelector, createSlice } from "@reduxjs/toolkit";
import {
    compressedType,
    findDependentItems,
    getCompressedType,
    RootState,
    Selector,
} from "../store";
import { characterObjectsSelector } from "./characters-slice";

const stories = {
    story_1: {
        name: "The Oak Professor",
        characters: ["char_1"],
        timeline: ["t1", "t2"],
    },
    story_2: {
        name: "A Time For A Change",
        characters: ["char_1", "char_2"],
        timeline: ["t3"],
    },
    story_3: {
        name: "The Rock",
        characters: ["char_3"],
        timeline: ["t2", "t3"],
    },
    story_4: {
        name: "No Questions Asked",
        characters: ["char_1", "char_2", "char_3"],
        timeline: ["t1", "t3"],
    },
    story_5: {
        name: "Backwards",
        characters: ["char_2", "char_3"],
        timeline: ["t2"],
    },
};

const initialStoriesState = {
    storyObjects: stories,
    selectedStoryName: "All",
};

const storiesSlice = createSlice({
    name: "storiesSlice",
    initialState: initialStoriesState,
    reducers: {
        setSelectedStoryName(state, action) {
            state.selectedStoryName = action.payload;
        },
        addStory(state, action) {
            const lastStoryId = Object.keys(state.storyObjects)
                .sort()
                .at(-1)
                .split("_")[1];
            const newId = "story".concat(
                "_",
                (parseInt(lastStoryId) + 1).toString()
            );
            state.storyObjects[newId] = {
                name: action.payload,
                characters: [],
                timeline: [],
            };
        },
        addCharacterToStory(state, action) {
            const arrayObj = getCompressedType(
                state.storyObjects,
                "storiesCharacters"
            );
            const storyFound = arrayObj.find(
                (story) => story.obj.name === action.payload[1]
            );
            storyFound.obj.items.push(action.payload[0]);
        },
        changeStoryName(state, action) {
            state.storyObjects[action.payload[0]].name = action.payload[1];
        },
        addTimeline(state, action) {
            // action.payload = timelineEventId
            console.log("story slice")
            const storyId = Object.keys(state.storyObjects).find(
                (storyId) => 
                    state.storyObjects[storyId].name === state.selectedStoryName
            );
            state.storyObjects[storyId].timeline.push(
                action.payload
            );
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

export default storiesSlice.reducer;
export const storiesActions = storiesSlice.actions;
