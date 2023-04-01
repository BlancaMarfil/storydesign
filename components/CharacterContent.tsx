import { useRouter } from "next/router";
import { Fragment, useEffect, useRef, useState } from "react";
import MainButton from "./UI/MainButton";
import styles from "./CharacterContent.module.css";
import EditableLabel from "./UI/EditableLabel";
import { useDispatch, useSelector } from "react-redux";
import {
    addNewAttribute,
    addNewDescription,
    charactersSortedSelector,
    deleteDescription,
    deleteFeature,
    editCharacterName,
    editDescription,
    editFeature,
    selectedCharacterNameSelector,
} from "../store/characters-slice";
import { AppDispatch } from "../store";
import IconEditableLabel from "./UI/IconEditableLabel";
import { selectedStoryNameSelector } from "../store/stories-slice";

const CharacterContent = () => {
    // Router
    const router = useRouter();

    // Constants and variables
    let componentDidMount = useRef(false);

    // State
    const [inputVisible, setInputVisible] = useState(true);
    const [labelIdClicked, setLabelIdClicked] = useState("");
    const [infoAdded, setInfoAdded] = useState({ attId: "", previousOrder: 0 });
    const [isLabel, setIsLabel] = useState(true);

    // Selectors
    const storySelectedName = useSelector(selectedStoryNameSelector);
    const characterSelectedName = useSelector(selectedCharacterNameSelector);
    const allCharacters = useSelector(charactersSortedSelector)
    const characterFound = allCharacters.find(
        (char) => char.name == characterSelectedName
    );

    // Dispatch
    const dispatch = useDispatch<AppDispatch>();

    // Functions

    // ---------- Change Character Name

    const changeCharacterNameHandler = async (newName: string) => {
        await dispatch(editCharacterName(characterFound.id, newName));
    };

    // ---------- Inputs

    const onClickAddInputHandler = (id: string) => {
        setInputVisible(true);
        setLabelIdClicked(id);
    };

    const onBlurHandler = (inputValue: string) => {
        if (inputValue === "") {
            setInputVisible(false);
            setLabelIdClicked("");
        }
    };

    // ---------- Add New Detail

    const addNewDetailHandler = async (
        attrId: string,
        previousOrder: number,
        value: string
    ) => {
        await dispatch(
            addNewDescription(
                characterFound.id,
                attrId,
                previousOrder + 1,
                value
            )
        );
        setInfoAdded({ attId: attrId, previousOrder: previousOrder });
    };

    // ---------- Add New Feature

    const addNewFeaturehandler = async (
        previousOrder: number,
        value: string
    ) => {
        await dispatch(
            addNewAttribute(characterFound.id, previousOrder + 1, value)
        );
        setIsLabel(false);
        setInputVisible(false);
    };

    // ---------- Modifying Detail

    const modifyDetailHandler = async (
        attributeId: string,
        descriptionId: string,
        newValue: string
    ) => {
        if (newValue !== "") {
            await dispatch(
                editDescription(
                    characterFound.id,
                    attributeId,
                    descriptionId,
                    newValue
                )
            );
        } else {
            await dispatch(
                deleteDescription(characterFound.id, attributeId, descriptionId)
            );
        }
    };

    // ---------- Modifying Feature

    const modifyFeatureHandler = async (
        attributeId: string,
        newValue: string,
        attrOrder: Number
    ) => {
        if (newValue !== "") {
            await dispatch(
                editFeature(characterFound.id, attributeId, newValue)
            );
        } else if (attrOrder == 0) {
            await dispatch(
                editFeature(
                    characterFound.id,
                    attributeId,
                    "Write a main feature for your character here..."
                )
            );
        } else {
            await dispatch(deleteFeature(characterFound.id, attributeId));
        }
    };

    // Use Effect
    useEffect(() => {
        if (componentDidMount.current) {
            // Add new field
            const attribute = characterFound.attributes.find(
                (att) => att.id === infoAdded.attId
            );
            const descId = attribute.descriptions.find(
                (desc) => desc.order === infoAdded.previousOrder + 1
            ).id;
            setLabelIdClicked(descId);
            setInputVisible(true);
        }
        componentDidMount.current = true;
    }, [infoAdded]);

    return (
        <Fragment>
            <div className={styles.section}>
                <div className={styles["btn-top"]}>
                    <MainButton
                        btn_type="blue"
                        onClickHandler={() =>
                            router.push(`/stories/${storySelectedName}`)
                        }
                    >
                        Back
                    </MainButton>
                    <MainButton
                        btn_type="green"
                        onClickHandler={() =>
                            router.push(`/timeline/${storySelectedName}`)
                        }
                    >
                        Timeline
                    </MainButton>
                </div>
                <div className={styles.section}>
                    <EditableLabel
                        isLabel={true}
                        initValue={characterSelectedName}
                        onClickLabel={(value) =>
                            changeCharacterNameHandler(value)
                        }
                        classNameLabel="section-title"
                        classNameInput="modal-input-edit section-title"
                        onBlurInput={(value) => onBlurHandler(value)}
                    />
                </div>

                <hr className={styles["hr"]} />

                <div className={styles["whole-content"]}>
                    {characterFound.attributes.map((attribute) => (
                        <div
                            key={attribute.id}
                            className={styles["whole-feature"]}
                        >
                            <IconEditableLabel
                                divStyle="functions-div-feature"
                                isLabel={true}
                                labelInitValue={attribute.feature}
                                onClickIcon={() =>
                                    onClickAddInputHandler(attribute.id)
                                }
                                onClickLabel={(value) =>
                                    modifyFeatureHandler(
                                        attribute.id,
                                        value,
                                        attribute.order
                                    )
                                }
                                classNameLabel="label-edit main-label"
                                classNameInput="modal-input-edit main-label"
                                onBlurInput={(value) => onBlurHandler(value)}
                            />
                            {attribute.descriptions.map((desc) => (
                                <Fragment key={desc.id}>
                                    <IconEditableLabel
                                        divStyle="functions-div"
                                        isLabel={isLabel}
                                        labelInitValue={desc.value}
                                        onClickIcon={() =>
                                            onClickAddInputHandler(desc.id)
                                        }
                                        onClickLabel={(value) =>
                                            modifyDetailHandler(
                                                attribute.id,
                                                desc.id,
                                                value
                                            )
                                        }
                                        classNameLabel="label-edit feature-detail-specific"
                                        classNameInput="modal-input-edit feature-detail-specific"
                                        onBlurInput={(value) =>
                                            onBlurHandler(value)
                                        }
                                    />
                                    {labelIdClicked == desc.id &&
                                        inputVisible && (
                                            <div
                                                className={
                                                    styles["functions-div"]
                                                }
                                            >
                                                <EditableLabel
                                                    isLabel={false}
                                                    initValue=""
                                                    onClickLabel={(value) =>
                                                        addNewDetailHandler(
                                                            attribute.id,
                                                            desc.order,
                                                            value
                                                        )
                                                    }
                                                    classNameLabel="label-edit feature-detail-specific"
                                                    classNameInput="modal-input-edit feature-detail-specific"
                                                    onBlurInput={(value) =>
                                                        onBlurHandler(value)
                                                    }
                                                />
                                            </div>
                                        )}
                                </Fragment>
                            ))}
                            {labelIdClicked === attribute.id && inputVisible && (
                                <div className={styles["functions-div"]}>
                                    <EditableLabel
                                        isLabel={false}
                                        initValue=""
                                        onClickLabel={(value) =>
                                            addNewFeaturehandler(
                                                attribute.order,
                                                value
                                            )
                                        }
                                        classNameLabel="label-edit main-label"
                                        classNameInput="modal-input-edit main-label"
                                        onBlurInput={(value) =>
                                            onBlurHandler(value)
                                        }
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </Fragment>
    );
};

export default CharacterContent;
