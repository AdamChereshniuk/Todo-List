import { Link } from "react-router-dom";
import "./MainPage.css";

export const MainPage = ({ isUserAuthorized, onClickLoginBtn }: { isUserAuthorized: boolean, onClickLoginBtn: () => void }) => {
    return (
        <div className="main-page">
            <div className="container">
                <div className="main-page__inner">
                    {isUserAuthorized ? (
                        <>
                            <h1 className="main-page__title title">ToDo List</h1>
                            <div className="main-page__texts">
                                <p className="main-page__text">ToDo List - сервис для планирования задач с личным кабинетом.</p>
                                <p className="main-page__text">Нажмите на кнопку, чтобы перейти к заметкам.</p>
                            </div>
                            <Link className="main-page__btn btn" to="/notes">Перейти к заметкам</Link>
                        </>
                    ) : (
                        <>
                            <h1 className="main-page__title title">ToDo List</h1>
                            <div className="main-page__texts">
                                <p className="main-page__text">ToDo List - сервис для планирования задач с личным кабинетом.</p>
                                <p className="main-page__text">Зарегистрируйтесь или войдите в профиль для пользования сервисом.</p>
                            </div>
                            <button className="main-page__btn btn" onClick={onClickLoginBtn}>Регистрация / Вход</button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};