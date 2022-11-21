import { configureStore } from "@reduxjs/toolkit";
import categoriesSlice from "./categories-slice";
import charactersSlice from "./characters-slice";
import storiesSlice from "./stories-slice";
import timelineSlice from "./timeline-slice";

const store = configureStore({
    reducer: {
        categories: categoriesSlice,
        stories: storiesSlice,
        characters: charactersSlice,
        timeline: timelineSlice,
    },
});

// Functions
const getItems = (type: string, objects: any, id: string): string[] => {
    let items: string[];
    switch (type) {
        case "categories":
            items = objects[id].stories;
            break;
        case "storiesCharacters":
            items = objects[id].characters;
            break;
        case "characters":
            items = objects[id].attributes;
        case "storiesTimeline":
            items = objects[id].timeline;
        default:
            break;
    }
    return items;
};

export const getCompressedType = (objects: any, type: string) => {
    const arrayObj = Object.keys(objects).map((id) => {
        const name: string = objects[id].name;
        const items = getItems(type, objects, id);
        const obj = { name: name, items: items };
        return { id, obj };
    });
    return arrayObj;
};

export const findDependentItems = (
    searchIn: compressedType[],
    searchFor: any,
    searchName: string,
    type: string
) => {
    let ids: string[];
    if (searchName === "All") {
        ids = Object.keys(searchFor);
    } else {
        const objectFound = searchIn.find((a) => a.obj.name === searchName);
        ids = objectFound.obj.items;
    }
    return ids.map((id: string) => {
        const name: string = searchFor[id].name;
        const items = getItems(type, searchFor, id);
        const obj = { name: name, items: items };
        const tempObject = { id, obj };
        return tempObject;
    });
};

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export type Selector<S> = (state: RootState) => S;
export type compressedType = {
    id: string;
    obj: { name: string; items: string[] };
};
