export const firebaseUrl =
    "https://story-design-c2150-default-rtdb.europe-west1.firebasedatabase.app";

export const fbOperations = {
    categoriesOp: {
        url: `${firebaseUrl}/categories.json`,
        //mappingFunction: mappingCategoryObj,
        addNewCategory: (categoryName: string) => ({
            url: `${firebaseUrl}/categories.json`,
            method: "POST",
            body: { name: categoryName },
        }),
        deleteCategory: (id: string) => ({
            url: `${firebaseUrl}/categories/${id}.json`,
            method: "DELETE",
        }),
        editCategory: (id: string, newName: string) => ({
            url: `${firebaseUrl}/categories/${id}/name.json`,
            method: "PUT",
            body: newName,
        }),
        addStoryToCategory: (categoryId: string, storyId: string) => ({
            url: `${firebaseUrl}/categories/${categoryId}/stories.json`,
            method: "POST",
            body: storyId,
        }),
    },
    storiesOp: {
        url: `${firebaseUrl}/stories.json`,
        //mappingFunction: mappingStoryObj,
        addNewStory: (storyName: string) => ({
            url: `${firebaseUrl}/stories.json`,
            method: "POST",
            body: { name: storyName },
        }),
        addCharacterToStory: (storyId: string, charId: string) => ({
            url: `${firebaseUrl}/stories/${storyId}/characters.json`,
            method: "POST",
            body: charId,
        }),
        addTimelineToStory: (storyId: string, timelineId: string) => ({
            url: `${firebaseUrl}/stories/${storyId}/timeline.json`,
            method: "POST",
            body: timelineId,
        }),
        deleteTimelineFromStory: (storyId: string, timelineId: string) => ({
            url: `${firebaseUrl}/stories/${storyId}/timeline/${timelineId}.json`,
            method: "DELETE",
        }),
        getTimelinesFromStory: (storyId: string) => ({
            url: `${firebaseUrl}/stories/${storyId}/timeline.json`,
            method: "GET",
        }),
    },
    charactersOp: {
        url: `${firebaseUrl}/characters.json`,
        //mappingFunction: mappingCharacterObj,
        loadCharacters: () => {
            return [
                `${firebaseUrl}/characters.json`,
                { method: "GET", body: null },
            ];
        },
        addNewCharacter: (charName: string) => ({
            url: `${firebaseUrl}/characters.json`,
            method: "POST",
            body: { name: charName },
        }),
        addNewAttribute: (charId: string, order: Number, feature: string) => ({
            url: `${firebaseUrl}/characters/${charId}/attributes.json`,
            method: "POST",
            body: { order: order, feature: feature },
        }),
        addNewDescription: (
            charId: string,
            attrId: string,
            order: Number,
            value: string
        ) => ({
            url: `${firebaseUrl}/characters/${charId}/attributes/${attrId}/descriptions.json`,
            method: "POST",
            body: { order: order, value: value },
        }),
        editCharacterName: (charId: string, newName: string) => ({
            url: `${firebaseUrl}/characters/${charId}/name.json`,
            method: "PUT",
            body: newName,
        }),
        editFeature: (charId: string, attrId: string, newFeature: string) => ({
            url: `${firebaseUrl}/characters/${charId}/attributes/${attrId}/feature.json`,
            method: "PUT",
            body: newFeature,
        }),
        deleteFeature: (charId: string, attrId: string) => ({
            url: `${firebaseUrl}/characters/${charId}/attributes/${attrId}.json`,
            method: "DELETE",
        }),
        editDescription: (
            charId: string,
            attrId: string,
            descId: string,
            newDesc: string
        ) => ({
            url: `${firebaseUrl}/characters/${charId}/attributes/${attrId}/descriptions/${descId}/value.json`,
            method: "PUT",
            body: newDesc,
        }),
        deleteDescription: (
            charId: string,
            attrId: string,
            descId: string
        ) => ({
            url: `${firebaseUrl}/characters/${charId}/attributes/${attrId}/descriptions(${descId}).json`,
            method: "DELETE",
        }),
    },
    timelineOp: {
        url: `${firebaseUrl}/timeline.json`,
        //mappingFunction: mappingTimelineObj,
        addNewEvent: (order: Number, eventValue: string) => ({
            url: `${firebaseUrl}/timeline.json`,
            method: "POST",
            body: { order: order, event: eventValue },
        }),
        addNewDetail: (timelineId: string, order: Number, value: string) => ({
            url: `${firebaseUrl}/timeline/${timelineId}/details.json`,
            method: "POST",
            body: { order: order, value: value },
        }),
        editEvent: (timelineId: string, newValue: string) => ({
            url: `${firebaseUrl}/timeline/${timelineId}/event.json`,
            method: "PUT",
            body: newValue,
        }),
        deleteEvent: (timelineId: string) => ({
            url: `${firebaseUrl}/timeline/${timelineId}.json`,
            method: "DELETE",
        }),
        editDetail: (
            timelineId: string,
            detailId: string,
            newValue: string
        ) => ({
            url: `${firebaseUrl}/timeline/${timelineId}/details/${detailId}/value.json`,
            method: "PUT",
            body: newValue,
        }),
        deleteDetail: (timelineId: string, detailId: string) => ({
            url: `${firebaseUrl}/timeline/${timelineId}/details/${detailId}.json`,
            method: "DELETE",
        }),
    },
};
