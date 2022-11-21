import { createSelector, createSlice } from "@reduxjs/toolkit";
import { compressedType, getCompressedType, RootState, Selector } from ".";

interface descriptionFormat {
    order: number;
    value: string;
}

interface attributeFormat {
    order: number;
    feature: string;
    descriptions: Record<string, descriptionFormat>;
}

interface characterFormat {
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

const characters: Record<string, characterFormat> = {
    char_1: {
        name: "Catherine Silvester",
        attributes: {
            a1: {
                order: 0,
                feature: "Full Name",
                descriptions: {
                    d1: {
                        order: 0,
                        value: "Catherine Louise Silver",
                    },
                },
            },
            a2: {
                order: 1,
                feature: "Occupation",
                descriptions: {
                    d2: {
                        order: 0,
                        value: "Former spy for the English Crown",
                    },
                    d3: {
                        order: 1,
                        value: "Fake carpenter",
                    },
                },
            },
            a3: {
                order: 2,
                feature: "Appearance",
                descriptions: {
                    d4: {
                        order: 0,
                        value: "Brown hair",
                    },
                    d5: {
                        order: 1,
                        value: "Green eyes",
                    },
                    d6: {
                        order: 2,
                        value: "1,59m height",
                    },
                },
            },
        },
    },
    char_2: {
        name: "John Spike",
        attributes: {
            a4: {
                order: 0,
                feature: "Full Name",
                descriptions: {
                    d7: {
                        order: 0,
                        value: "Johnathan Spike Smith",
                    },
                },
            },
            a5: {
                order: 1,
                feature: "Origin",
                descriptions: {
                    d8: {
                        order: 0,
                        value: "Austria",
                    },
                    d9: {
                        order: 1,
                        value: "Currently living in France",
                    },
                },
            },
            a6: {
                order: 2,
                feature: "Occupation",
                descriptions: {
                    d10: {
                        order: 0,
                        value: "Carpenter",
                    },
                    d11: {
                        order: 1,
                        value: "Owner of 'Fair Woods & Co.'",
                    },
                },
            },
            a7: {
                order: 3,
                feature: "Appearance",
                descriptions: {
                    d12: {
                        order: 0,
                        value: "Dark blond hair",
                    },
                    d13: {
                        order: 1,
                        value: "Blue eyes",
                    },
                },
            },
        },
    },
    char_3: {
        name: "Richard Stone",
        attributes: {
            a8: {
                order: 0,
                feature: "Full Name",
                descriptions: {
                    d14: {
                        order: 0,
                        value: "Richard Evans Stone",
                    },
                },
            },
            a9: {
                order: 1,
                feature: "Occupation",
                descriptions: {
                    d15: {
                        order: 0,
                        value: "President of X-Raymond",
                    },
                },
            },
            a10: {
                order: 2,
                feature: "Past",
                descriptions: {
                    d16: {
                        order: 0,
                        value: "Abandoned whan he was a child",
                    },
                    d17: {
                        order: 1,
                        value: "Taken in by a gang",
                    },
                    d18: {
                        order: 2,
                        value: "Founded X-Raymond and the killed his partner",
                    },
                },
            },
        },
    },
};

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
    characterObjects: characters,
    selectedCharacterName: "",
};

const charactersSlice = createSlice({
    name: "charactersSlice",
    initialState: initialCharactersState,
    reducers: {
        setSelectedCharacterName(state, action) {
            state.selectedCharacterName = action.payload;
        },
        addCharacter(state, action) {
            const lastCharacterId = Object.keys(state.characterObjects)
                .sort()
                .at(-1)
                .split("_")[1];
            const newId = "char".concat(
                "_",
                (parseInt(lastCharacterId) + 1).toString()
            );
            state.characterObjects[newId] = {
                name: action.payload,
                attributes: null,
            };
        },
        changeCharacterName(state, action) {
            const character = findCharacterSelectedId(
                state.characterObjects,
                state.selectedCharacterName
            );
            character.name = action.payload;
        },
        addDescriptionToCharacter(state, action) {
            // action.payload = [attributeId, detailOrder, detailValue]
            const character = findCharacterSelectedId(
                state.characterObjects,
                state.selectedCharacterName
            );
            const attribute = character.attributes[action.payload[0]];

            // Modify order of following details
            Object.keys(attribute.descriptions).map((descId) => {
                const desc = attribute.descriptions[descId];
                desc.order =
                    desc.order >= action.payload[1]
                        ? desc.order + 1
                        : desc.order;
            });

            const newDescId = Math.random().toString();
            attribute.descriptions[newDescId] = {
                order: action.payload[1],
                value: action.payload[2],
            };
        },
        addFeatureToCharacter(state, action) {
            // action.payload = [attOrder, featureValue]
            const character = findCharacterSelectedId(
                state.characterObjects,
                state.selectedCharacterName
            );

            // Modify order of following attributes
            Object.keys(character.attributes).map((attId) => {
                const att = character.attributes[attId];
                att.order =
                    att.order >= action.payload[0] ? att.order + 1 : att.order;
            });

            const newAttId = Math.random().toString();
            const newDescription: Record<string, descriptionFormat> = {
                newAttId: { order: 0, value: "New Description" },
            };
            character.attributes[newAttId] = {
                order: action.payload[0],
                feature: action.payload[1],
                descriptions: newDescription,
            };
        },
        modifyDetail(state, action) {
            // action.payload = [attributeId, descriptionId, newValue]
            const character = findCharacterSelectedId(
                state.characterObjects,
                state.selectedCharacterName
            );
            const attribute = character.attributes[action.payload[0]];
            attribute.descriptions[action.payload[1]].value = action.payload[2];
        },
        modifyFeature(state, action) {
            // action.payload = [attributeId, newValue]
            const character = findCharacterSelectedId(
                state.characterObjects,
                state.selectedCharacterName
            );
            const attribute = character.attributes[action.payload[0]];
            attribute.feature = action.payload[1];
        },
        deleteDetail(state, action) {
            // action.payload = [attributeId, descriptionId]
            const character = findCharacterSelectedId(
                state.characterObjects,
                state.selectedCharacterName
            );
            const attribute = character.attributes[action.payload[0]];
            const deleteDescOrder =
                attribute.descriptions[action.payload[1]].order;
            delete attribute.descriptions[action.payload[1]];

            // Rearrange orders
            Object.keys(attribute.descriptions).map((descId) => {
                const desc = attribute.descriptions[descId];
                desc.order =
                    desc.order > deleteDescOrder ? desc.order - 1 : desc.order;
            });
        },
        deleteFeature(state, action) {
            // action.payload = attributeId
            const character = findCharacterSelectedId(
                state.characterObjects,
                state.selectedCharacterName
            );
            delete character.attributes[action.payload];
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
            const attributesObjects = character.attributes;
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

export default charactersSlice.reducer;
export const characterActions = charactersSlice.actions;
