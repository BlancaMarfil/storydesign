import { createSelector, createSlice } from "@reduxjs/toolkit";
import { RootState, Selector } from ".";
import { firebaseUrl } from "../components/hooks/httpFunctions";

export interface descriptionFormat {
    order: number;
    value: string;
}

export interface attributeFormat {
    order: number;
    feature: string;
    descriptions: Record<string, descriptionFormat>;
}

export interface characterFormat {
    name: string;
    attributes: Record<string, attributeFormat>;
}

export interface compressedTypeCharacter {
    id: string;
    name: string;
    attributes: {
        id: string;
        order: number;
        feature: string;
        descriptions: {
            id: string;
            order: number;
            value: string;
        }[];
    }[];
}

const findCharacterSelectedId = (
    characterObjects: Record<string, characterFormat>,
    charName: string
) => {
    const charId = Object.keys(characterObjects).find(
        (charId) => characterObjects[charId].name == charName
    );
    return characterObjects[charId];
};

const initialCharactersState = {
    characterObjects: {} as Record<string, characterFormat>,
    selectedCharacterName: "",
};

const charactersSlice = createSlice({
    name: "charactersSlice",
    initialState: initialCharactersState,
    reducers: {
        loadCharacters(state, action) {
            state.characterObjects = action.payload;
        },
        setSelectedCharacterName(state, action) {
            state.selectedCharacterName = action.payload;
        },
        addCharacter(state, action) {
            const descriptions = {} as Record<string, descriptionFormat>;
            descriptions[action.payload[3]] = {
                order: 0,
                value: "Write your character description here...",
            };
            const attributes = {} as Record<string, attributeFormat>;
            attributes[action.payload[2]] = {
                order: 0,
                feature: "Write a main feature for your character here...",
                descriptions: descriptions,
            };

            state.characterObjects[action.payload[0]] = {
                name: action.payload[1],
                attributes: attributes,
            };
        },
        changeCharacterName(state, action) {
            state.characterObjects[action.payload[0]].name = action.payload[1];
        },
        addDescriptionToCharacter(state, action) {
            state.characterObjects[action.payload[0]].attributes[
                action.payload[1]
            ].descriptions[action.payload[2]] = {
                order: action.payload[3],
                value: action.payload[4],
            };
        },
        addFeatureToCharacter(state, action) {
            const descriptions = {} as Record<string, descriptionFormat>;
            descriptions[action.payload[2]] = {
                order: 0,
                value: "Write your character description here...",
            };
            state.characterObjects[action.payload[0]].attributes[
                action.payload[1]
            ] = {
                order: action.payload[3],
                feature: action.payload[4],
                descriptions: descriptions,
            };
        },
        modifyDetail(state, action) {
            state.characterObjects[action.payload[0]].attributes[
                action.payload[1]
            ].descriptions[action.payload[2]].value = action.payload[3];
        },
        modifyFeature(state, action) {
            state.characterObjects[action.payload[0]].attributes[
                action.payload[1]
            ].feature = action.payload[2];
        },
        deleteDetail(state, action) {
            delete state.characterObjects[action.payload[0]].attributes[
                action.payload[1]
            ].descriptions[action.payload[2]];
        },
        deleteFeature(state, action) {
            delete state.characterObjects[action.payload[0]].attributes[
                action.payload[1]
            ];
        },
    },
});

// SELECTORS
export const characterObjectsSelector = (state: RootState) =>
    state.characters.characterObjects;
export const selectedCharacterNameSelector = (state: RootState) =>
    state.characters.selectedCharacterName;

export const charactersSortedSelector: Selector<compressedTypeCharacter[]> =
    createSelector(characterObjectsSelector, (characters) => {
        const charactersCompressed = Object.keys(characters).map((charId) => {
            const character = characters[charId];
            const attributesObjects = character.attributes || {};
            const attributesCompressed = Object.keys(attributesObjects).map(
                (attId) => {
                    const attInfo = attributesObjects[attId];
                    const descObjects = attInfo.descriptions;
                    const descCompressed = Object.keys(descObjects).map(
                        (descId) => {
                            const descInfo = descObjects[descId];
                            return {
                                id: descId,
                                order: descInfo.order,
                                value: descInfo.value,
                            };
                        }
                    );

                    const descSorted = descCompressed.sort((a, b) =>
                        a.order < b.order ? -1 : a.order > b.order ? 1 : 0
                    );

                    return {
                        id: attId,
                        order: attInfo.order,
                        feature: attInfo.feature,
                        descriptions: descSorted,
                    };
                }
            );

            const attSorted = attributesCompressed.sort((a, b) =>
                a.order < b.order ? -1 : a.order > b.order ? 1 : 0
            );

            return {
                id: charId,
                name: character.name,
                attributes: attSorted,
            };
        });
        return charactersCompressed.sort((a, b) =>
            a.name < b.name ? -1 : a.name > b.name ? 1 : 0
        );
    });

const mappingCharacterObj = (data: any) => {
    const mappedData = {} as Record<string, characterFormat>;
    Object.keys(data).map((id) => {
        const mappedAttr = {} as Record<string, attributeFormat>;
        const attributes: Record<string, attributeFormat> = data[id].attributes;
        if (attributes !== undefined) {
            Object.keys(attributes).map((attrId) => {
                const mappedDesc = {} as Record<string, descriptionFormat>;
                const desc: Record<string, descriptionFormat> =
                    attributes[attrId].descriptions || {};
                Object.keys(desc).map((descId) => {
                    mappedDesc[descId] = {
                        order: desc[descId].order,
                        value: desc[descId].value,
                    };
                });

                mappedAttr[attrId] = {
                    order: attributes[attrId].order,
                    feature: attributes[attrId].feature,
                    descriptions: mappedDesc,
                };
            });
            mappedData[id] = { name: data[id].name, attributes: mappedAttr };
        } else {
            mappedData[id] = { name: data[id].name, attributes: {} };
        }
    });
    return mappedData;
};

export const loadCharacters = () => {
    return async (dispatch) => {
        try {
            const response = await fetch(`${firebaseUrl}/characters.json`, {
                method: "GET",
                headers: {},
                body: null,
            });

            const data: any = await response.json();
            dispatch(
                characterActions.loadCharacters(mappingCharacterObj(data))
            );
        } catch (error) {
            console.error(error);
        }
    };
};

export const addNewCharacter = (charName: string) => {
    const newDescId = Math.floor(100000 + Math.random() * 900000).toString();
    const descriptions = {};
    descriptions[newDescId] = {
        order: 0,
        value: "Write your character description here...",
    };
    const attrId = Math.floor(100000 + Math.random() * 900000).toString();
    const attributes = {};
    attributes[attrId] = {
        order: 0,
        feature: "Write a main feature for your character here...",
        descriptions: descriptions,
    };

    return async (dispatch) => {
        try {
            const response = await fetch(`${firebaseUrl}/characters.json`, {
                method: "POST",
                body: JSON.stringify({
                    name: charName,
                    attributes: attributes,
                }),
                headers: {},
            });

            const data: any = await response.json();
            dispatch(
                characterActions.addCharacter([
                    data.name,
                    charName,
                    attrId,
                    newDescId,
                ])
            );
            return data.name;
        } catch (error) {
            console.error(error);
        }
    };
};

export const addNewDescription = (
    charId: string,
    attrId: string,
    order: Number,
    value: string
) => {
    return async (dispatch) => {
        try {
            const response = await fetch(
                `${firebaseUrl}/characters/${charId}/attributes/${attrId}/descriptions.json`,
                {
                    method: "POST",
                    body: JSON.stringify({ order: order, value: value }),
                    headers: {},
                }
            );

            const data: any = await response.json();
            dispatch(
                characterActions.addDescriptionToCharacter([
                    charId,
                    attrId,
                    data.name,
                    order,
                    value,
                ])
            );
            return data.name;
        } catch (error) {
            console.error(error);
        }
    };
};

export const addNewAttribute = (
    charId: string,
    order: Number,
    feature: string
) => {
    const newDescId = Math.floor(100000 + Math.random() * 900000).toString();
    const descriptions = {};
    descriptions[newDescId] = {
        order: 0,
        value: "Write your character description here...",
    };
    return async (dispatch) => {
        try {
            const response = await fetch(
                `${firebaseUrl}/characters/${charId}/attributes.json`,
                {
                    method: "POST",
                    body: JSON.stringify({
                        order: order,
                        feature: feature,
                        descriptions: descriptions,
                    }),
                    headers: {},
                }
            );

            const data: any = await response.json();

            dispatch(
                characterActions.addFeatureToCharacter([
                    charId,
                    data.name,
                    newDescId,
                    order,
                    feature,
                ])
            );

            return data.name;
        } catch (error) {
            console.error(error);
        }
    };
};

export const editCharacterName = (charId: string, newName: string) => {
    return async (dispatch) => {
        try {
            const response = await fetch(
                `${firebaseUrl}/characters/${charId}/name.json`,
                {
                    method: "PUT",
                    body: JSON.stringify(newName),
                    headers: {},
                }
            );

            const data: any = await response.json();
            dispatch(characterActions.changeCharacterName([charId, newName]));
            dispatch(characterActions.setSelectedCharacterName(newName));
        } catch (error) {
            console.error(error);
        }
    };
};

export const editFeature = (
    charId: string,
    attrId: string,
    newFeature: string
) => {
    return async (dispatch) => {
        try {
            const response = await fetch(
                `${firebaseUrl}/characters/${charId}/attributes/${attrId}/feature.json`,
                {
                    method: "PUT",
                    body: JSON.stringify(newFeature),
                    headers: {},
                }
            );

            const data: any = await response.json();
            dispatch(
                characterActions.modifyFeature([charId, attrId, newFeature])
            );
        } catch (error) {
            console.error(error);
        }
    };
};

export const deleteFeature = (charId: string, attrId: string) => {
    return async (dispatch) => {
        try {
            const response = await fetch(
                `${firebaseUrl}/characters/${charId}/attributes/${attrId}.json`,
                {
                    method: "DELETE",
                    body: null,
                    headers: {},
                }
            );

            const data: any = await response.json();
            dispatch(characterActions.deleteFeature([charId, attrId]));
        } catch (error) {
            console.error(error);
        }
    };
};

export const editDescription = (
    charId: string,
    attrId: string,
    descId: string,
    newDesc: string
) => {
    return async (dispatch) => {
        try {
            const response = await fetch(
                `${firebaseUrl}/characters/${charId}/attributes/${attrId}/descriptions/${descId}/value.json`,
                {
                    method: "PUT",
                    body: JSON.stringify(newDesc),
                    headers: {},
                }
            );

            const data: any = await response.json();
            dispatch(
                characterActions.modifyDetail([charId, attrId, descId, newDesc])
            );
        } catch (error) {
            console.error(error);
        }
    };
};

export const deleteDescription = (
    charId: string,
    attrId: string,
    descId: string
) => {
    return async (dispatch) => {
        try {
            const response = await fetch(
                `${firebaseUrl}/characters/${charId}/attributes/${attrId}/descriptions(${descId}).json`,
                {
                    method: "DELETE",
                    body: null,
                    headers: {},
                }
            );

            const data: any = await response.json();
            dispatch(characterActions.deleteDetail([charId, attrId, descId]));
        } catch (error) {
            console.error(error);
        }
    };
};

export default charactersSlice.reducer;
export const characterActions = charactersSlice.actions;
