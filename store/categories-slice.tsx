import { createSelector, createSlice } from "@reduxjs/toolkit";
import { WritableDraft } from "immer/dist/internal";
import useHttp from "../components/hooks/use-http";
import {
    compressedType,
    getCompressedType,
    RootState,
    Selector,
} from "../store";
import {
    selectedStoryNameSelector,
    storiesCharactersSortedSelector,
} from "./stories-slice";

export interface categoryFormat {
    name: string;
    stories: string[];
}

const categories: Record<string, categoryFormat> = {
    category_1: {
        name: "Contemporary",
        stories: ["story_1", "story_3", "story_5"],
    },
    category_2: {
        name: "Crime",
        stories: ["story_1", "story_2"],
    },
    category_3: {
        name: "Historical",
        stories: ["story_2", "story_3", "story_5"],
    },
    category_4: {
        name: "Horror",
        stories: ["story_4", "story_5"],
    },
    category_5: {
        name: "Romance",
        stories: ["story_5"],
    },
    category_6: {
        name: "Suspense",
        stories: ["story_2", "story_3"],
    },
    category_7: {
        name: "Thriller",
        stories: ["story_4"],
    },
};

const initialCategoriesState = {
    categoryObjects: categories,
};

const categoriesSlice = createSlice({
    name: "categoriesSlice",
    initialState: initialCategoriesState,
    reducers: {
        addCategory(state, action) {
            const newId = Math.random().toString();
            state.categoryObjects[newId] = {
                name: action.payload,
                stories: [],
            };
        },
        deleteCategory(state, action) {
            delete state.categoryObjects[action.payload];
        },
        changeCategoryName(state, action) {
            state.categoryObjects[action.payload[0]].name = action.payload[1];
        },
        addStoryToCategory(state, action) {
            const arrayObj = getCompressedType(
                state.categoryObjects,
                "categories"
            );
            const categoryFound = arrayObj.find(
                (category) => category.id === action.payload[1]
            );
            categoryFound.obj.items.push(action.payload[0]);
        },
        deleteStoryFromCategory(state, action) {
            const stories: string[] =
                state.categoryObjects[action.payload[1]].stories;
            const filteredStories = stories.filter(
                (storyId) => storyId !== action.payload[0]
            );
            state.categoryObjects[action.payload[1]].stories = filteredStories;
        },
    },
});

// SELECTORS
const categoryObjectsSelector = (state: RootState) =>
    state.categories.categoryObjects;

export const categoriesSortedSelector: Selector<compressedType[]> =
    createSelector(categoryObjectsSelector, (categoryObjects) => {
        const arrayObj = getCompressedType(categoryObjects, "categories");
        return arrayObj.sort((a, b) =>
            a.obj.name < b.obj.name ? -1 : a.obj.name > b.obj.name ? 1 : 0
        );
    });

export const storyCategoriesSelector: Selector<compressedType[]> =
    createSelector(
        categoriesSortedSelector,
        storiesCharactersSortedSelector,
        selectedStoryNameSelector,
        (categories, stories, storyName) => {
            let categoriesFound = categories;
            if (storyName !== "All") {
                const storyId = stories.find(
                    (story) => story.obj.name == storyName
                ).id;
                categoriesFound = categories.filter((category) =>
                    category.obj.items.includes(storyId)
                );
            }
            return categoriesFound;
        }
    );

export default categoriesSlice.reducer;
export const categoriesActions = categoriesSlice.actions;
