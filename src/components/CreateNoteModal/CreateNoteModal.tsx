import { useForm } from "react-hook-form";
import { nhostClient } from "../../nhost/nhostClient";
import { Modal } from "../Modal/Modal";
import { useNhostClient } from "@nhost/react";
import { gql } from "graphql-request";
import "./CreateNoteModal.css";

export const CreateNoteModal = ({ isCreateNoteModalOpen, closeCreateNoteModal }: { isCreateNoteModalOpen: boolean, closeCreateNoteModal: () => void }) => {
    const { auth } = useNhostClient();
    const currentUser = nhostClient.auth.getUser();
    const { register, handleSubmit, formState: { errors, isValid } } = useForm();

    async function createNoteWithUserId(title: string, taskIds: string[], userId: string) {
        const CREATE_NOTE = `
            mutation CreateNoteWithUser($user_id: uuid!, $title: String!, $taskIds: [String!]!) {
                insert_notes_one(object: {
                    user_id: $user_id,
                    title: $title,
                    task_ids: $taskIds
                }) {
                    id
                    title
                    task_ids
                    created_at
                }
            }
        `;

        const response = await nhostClient.graphql.request({
            query: CREATE_NOTE,
            variables: { user_id: userId, title, taskIds },
        });

        if (response.body.errors) throw response.body.errors;

        return response.body.data;
    };
    
    return (
        <Modal className="create-note-modal" isModalOpen={isCreateNoteModalOpen} closeModal={closeCreateNoteModal} children={
            <div className="create-note-modal__content">
                <h1 className="create-note-modal__title title">Создать заметку</h1>
                <form className="create-note-modal__form" onSubmit={handleSubmit(({ title }) => {
                    currentUser.then(user => {
                        createNoteWithUserId(title, [], user.body.id || "0").then(() => window.location.href = "/Todo-List/notes");
                    });
                })}>
                    <input className="create-note-modal__input input" type="text" placeholder="Название" {...register("title", {
                        required: "Введите название",
                        minLength: {
                            value: 2,
                            message: "Минимальная длина названия 2 символа",
                        },
                        maxLength: {
                            value: 30,
                            message: "Максимальная длина названия 30 символов",
                        },
                    })} />
                    <button className="create-note-modal__btn btn">Создать</button>
                </form>
            </div>
        } />
    );
};