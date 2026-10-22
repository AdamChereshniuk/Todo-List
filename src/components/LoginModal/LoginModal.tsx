import { nhostClient } from "../../nhost/nhostClient";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Modal } from "../Modal/Modal";
import { useState } from "react";
import "./LoginModal.css";

interface IRegisterForm {
    email: string,
    password: string,
};

export const LoginModal = ({ isLoginModalOpen, closeLoginModal }: { isLoginModalOpen: boolean, closeLoginModal: () => void }) => {
    const { register, handleSubmit, formState: { errors, isValid } } = useForm<IRegisterForm>();
    
    const navigate = useNavigate();
    const [isRegisterSuccess, setIsRegisterSuccess] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [currentTab, setCurrentTab] = useState<"register" | "login">("register");

    const registerUser = async({ email, password }: IRegisterForm) => {
        try {
            const signupResponse = await nhostClient.auth.signUpEmailPassword({ email, password });

            const user = signupResponse.body?.session?.user;
            if (!user) throw new Error("Не удалось создать пользователя");

            return {
                success: true,
                user: signupResponse.body?.session?.user,
                session: signupResponse.body.session,
            };
        } catch (error) {
            console.error("Ошибка регистрации или обновления метаданных:", error);
            return { success: false, error };
        };
    };
    const loginUser = async({ email, password }: IRegisterForm) => {
        try {
            const loginResponse = await nhostClient.auth.signInEmailPassword({ email, password });

            const user = loginResponse.body?.session?.user;
            if (!user) throw new Error("Не удалось войти в аккаунт");

            return {
                success: true,
                user: loginResponse.body?.session?.user,
                session: loginResponse.body.session,
            };
        } catch (error) {
            console.error("Ошибка входа или обновления метаданных:", error);
            return { success: false, error };
        };
    };

    return (
        <Modal className="login-modal" isModalOpen={isLoginModalOpen} closeModal={closeLoginModal} children={
            <>
                {isRegisterSuccess ? (
                    <div className="login-modal__success">
                        <h2 className="login-modal__title login-modal__success-title title">Регистрация успешна!</h2>
                        <p className="login-modal__text">Перейдите по ссылке из письма, отправленного на вашу почту, чтобы завершить регистрацию</p>
                    </div>
                ) : (
                    <div className="login-modal__content">
                        <h2 className="login-modal__title title">{currentTab === "register" ? "Регистрация" : "Вход"}</h2>
                        <div className="login-modal__btns">
                            <button className={`login-modal__btn ${currentTab === "register" && "active"}`} onClick={() => setCurrentTab("register")}>Регистрация</button>
                            <button className={`login-modal__btn ${currentTab === "login" && "active"}`} onClick={() => setCurrentTab("login")}>Вход</button>
                        </div>
                        {currentTab === "register" ? (
                            <form className="login-modal__form" onSubmit={handleSubmit(async({ email, password }) => {
                                const result = await registerUser({ email, password });

                                if (result.success) {
                                    if (result.session) {
                                        navigate("/Todo-List/");
                                    } else {
                                        setIsRegisterSuccess(true);
                                    };
                                } else {
                                    setError("Произошла ошибка. Попробуйте снова.");
                                };
                            })}>
                                <input className="login-modal__input input" type="email" placeholder="Email" {...register("email", { required: "Введите email" })} />
                                <input className="login-modal__input input" type="password" placeholder="Пароль" {...register("password", {
                                    required: "Введите пароль",
                                    minLength: {
                                        value: 8,
                                        message: "Минимальная длина пароля 8 символов",
                                    },
                                    maxLength: {
                                        value: 20,
                                        message: "Максимальная длина пароля 20 символов",
                                    },
                                })} />
                                {error !== "" && <span>{error}</span>}
                                {errors.email && <span className="error">{errors.email.message}</span>}
                                {errors.password && <span className="error">{errors.password.message}</span>}
                                <button className="login-modal__form-btn btn" type="submit">Зарегистрироваться</button>
                            </form>
                        ) : (
                            <form className="login-modal__form" onSubmit={handleSubmit(async({ email, password }) => {
                                const result = await loginUser({ email, password });

                                if (result.success && result.session) {
                                    window.location.href = "/Todo-List/";
                                } else {
                                    setError("Произошла ошибка. Попробуйте снова.");
                                };
                            })}>
                                <input className="login-modal__input input" type="email" placeholder="Email" {...register("email", { required: "Введите email" })} />
                                <input className="login-modal__input input" type="password" placeholder="Пароль" {...register("password", {
                                    required: "Введите пароль",
                                    minLength: {
                                        value: 8,
                                        message: "Минимальная длина пароля 8 символов",
                                    },
                                    maxLength: {
                                        value: 20,
                                        message: "Максимальная длина пароля 20 символов",
                                    },
                                })} />
                                {error !== "" && <span>{error}</span>}
                                {errors.email && <span className="error">{errors.email.message}</span>}
                                {errors.password && <span className="error">{errors.password.message}</span>}
                                <button className="login-modal__form-btn btn" type="submit">Войти</button>
                            </form>
                        )}
                    </div>
                )}
            </>
        } />
    );
};