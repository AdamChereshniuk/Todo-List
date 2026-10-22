import { useEffect, useState } from "react";
import { nhostClient } from "../../nhost/nhostClient";
import "./NotesPage.css";
import { CreateNoteModal } from "../../components/CreateNoteModal/CreateNoteModal";
import { Link } from "react-router-dom";

export const NotesPage = () => {
    const [notes, setNotes] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [isCreateNoteModalOpen, setIsCreateNoteModalOpen] = useState(false);

    const fetchNotes = async() => {
        const response = await nhostClient.graphql.request({ query: `
            query MyQuery {
                notes {
                    id
                    user_id
                    title
                    task_ids
                    created_at
                }
            }
        `, });
        return response;
    };
    const openCreateNoteModal = () => setIsCreateNoteModalOpen(true);
    const closeCreateNoteModal = () => setIsCreateNoteModalOpen(false);

    useEffect(() => {
        fetchNotes().then(data => setNotes(data.body.data.notes)).catch(err => console.log(err));
    }, []);
    useEffect(() => {
        nhostClient.auth.getUser().then(user => setCurrentUser(user.body));
    }, []);

    return (
        <>
            <div className="notes-page">
                <div className="container">
                    <div className="notes-page__inner">
                        <div className="notes-page__top">
                            <h1 className="notes-page__title title">Заметки</h1>
                            <button className="notes-page__create-btn btn" onClick={openCreateNoteModal}>Создать заметку</button>
                        </div>
                        <div className="notes-page__main">
                            {notes !== null && currentUser !== null && notes.length !== 0 ? (
                                <div className="notes-page__main-inner">
                                    <ul className="notes-page__main-list">
                                        {notes.filter(note => note.user_id === currentUser.id).map(note => {
                                            return (
                                                <li className="notes-page__main-item">
                                                    <Link to={`/Todo-List/note/${note.id}`}>
                                                        <span className="notes-page__main-item-title">{note.title}</span>
                                                        <span className="notes-page__main-item-created-at">Создано {new Date(note.created_at).toLocaleDateString()}</span>
                                                    </Link>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            ) : (
                                <div className="notes-page__main-empty-inner">
                                    <h2 className="notes-page__main-empty-title">У вас нет заметок...</h2>
                                    <button className="notes-page__create-btn btn" onClick={openCreateNoteModal}>Создать заметку</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {isCreateNoteModalOpen && <CreateNoteModal isCreateNoteModalOpen closeCreateNoteModal={closeCreateNoteModal} />}
        </>
    );
};