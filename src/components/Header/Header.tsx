import { Link } from "react-router-dom";
import logo from "../../img/logo.svg";
import "./Header.css";

export const Header = ({ isUserAuthorized, onClickLoginBtn, onClickSignOutBtn }: { isUserAuthorized: boolean, onClickLoginBtn: () => void, onClickSignOutBtn: () => void }) => {
    return (
        <header className="header">
            <div className="container">
                <div className="header__inner">
                    <Link className="header__logo" to="/Todo-List/">
                        <img src={logo} alt="Лого" />
                    </Link>
                    {isUserAuthorized ? (
                        <button className="header__btn" onClick={onClickSignOutBtn}>Выйти</button>
                    ) : (
                        <button className="header__btn" onClick={onClickLoginBtn}>Регистрация / Вход</button>
                    )}
                </div>
            </div>
        </header>
    );
};