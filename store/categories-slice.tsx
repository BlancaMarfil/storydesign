import { createSelector, createSlice } from "@reduxjs/toolkit";

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
import { firebaseUrl } from "../components/hooks/httpFunctions";

export interface categoryFormat {
    name: string;
    stories: string[];
}

const initialCategoriesState = {
    categoryObjects: {} as Record<string, categoryFormat>,
};

const categoriesSlice = createSlice({
    name: "categoriesSlice",
    initialState: initialCategoriesState,
    reducers: {
        loadCategories(state, action) {
            state.categoryObjects = action.payload;
        },
        addCategory(state, action) {
            state.categoryObjects[action.payload[0]] = {
                name: action.payload[1],
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
            state.categoryObjects[action.payload[1]].stories.push(
                action.payload[0]
            );
        },
        deleteStoryFromCategory(state, action) {
            // const stories: string[] =
            //     state.categoryObjects[action.payload[1]].stories;
            // const filteredStories = stories.filter(
            //     (storyId) => storyId !== action.payload[0]
            // );
            // state.categoryObjects[action.payload[1]].stories = filteredStories;

            const arrStories = state.categoryObjects[action.payload[0]].stories;
            arrStories.splice(arrStories.indexOf(action.payload[1]), 1);
        },
    },
});

interface expectedJSONFormat {
    name: string;
}

// SELECTORS
export const categoryObjectsSelector = (state: RootState) =>
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

// THUNKS

const mappingCategoryObj = (data: any) => {
    const mappedData = {} as Record<string, categoryFormat>;
    Object.keys(data).map((id) => {
        const stories: string[] =
            data[id].stories && Object.values(data[id].stories);
        mappedData[id] = { name: data[id].name, stories: stories || [] };
    });
    return mappedData;
};

export const loadCategories = () => {
    return async (dispatch) => {
        try {
            const response = await fetch(`${firebaseUrl}/categories.json`, {
                method: "GET",
                headers: {},
                body: null,
            });

            const data: any = await response.json();
            dispatch(
                categoriesActions.loadCategories(mappingCategoryObj(data))
            );
        } catch (error) {
            console.error(error);
        }
    };
};

export const addNewCategory = (categoryName: string) => {
    return async (dispatch) => {
        try {
            const response = await fetch(`${firebaseUrl}/categories.json`, {
                method: "POST",
                body: JSON.stringify({ name: categoryName }),
                headers: {},
            });

            const data: any = await response.json();
            dispatch(categoriesActions.addCategory([data.name, categoryName]));
        } catch (error) {
            console.error(error);
        }
    };
};

export const deleteCategory = (categoryId: string) => {
    return async (dispatch) => {
        try {
            const response = await fetch(
                `${firebaseUrl}/categories/${categoryId}.json`,
                {
                    method: "DELETE",
                    body: null,
                    headers: {},
                }
            );

            const data: any = await response.json();
            dispatch(categoriesActions.deleteCategory(categoryId));
        } catch (error) {
            console.error(error);
        }
    };
};

export const editCategory = (categoryId: string, newName: string) => {
    return async (dispatch) => {
        try {
            const response = await fetch(
                `${firebaseUrl}/categories/${categoryId}/name.json`,
                {
                    method: "PUT",
                    body: JSON.stringify({ name: newName }),
                    headers: {},
                }
            );

            const data: any = await response.json();
            dispatch(
                categoriesActions.changeCategoryName([categoryId, newName])
            );
        } catch (error) {
            console.error(error);
        }
    };
};

export const addStoryToCategory = (categoryId: string, storyId: string) => {
    return async (dispatch) => {
        try {
            const response = await fetch(
                `${firebaseUrl}/categories/${categoryId}/stories.json`,
                {
                    method: "POST",
                    body: JSON.stringify(storyId),
                    headers: {},
                }
            );

            const data: any = await response.json();
            dispatch(
                categoriesActions.addStoryToCategory([storyId, categoryId])
            );
        } catch (error) {
            console.error(error);
        }
    };
};

export const deleteStoryFromCategory = (
    categoryId: string,
    storyId: string
) => {
    return async (dispatch) => {
        try {
            const response = await fetch(
                `${firebaseUrl}/categories/${categoryId}/stories/${storyId}.json`,
                {
                    method: "DELETE",
                    body: null,
                    headers: {},
                }
            );

            const data: any = await response.json();
            dispatch(
                categoriesActions.deleteStoryFromCategory([categoryId, storyId])
            );
        } catch (error) {
            console.error(error);
        }
    };
};

export default categoriesSlice.reducer;
export const categoriesActions = categoriesSlice.actions;
