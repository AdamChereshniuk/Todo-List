import { ReactNode } from "react";
import cross from "../../img/cross.svg";
import "./Modal.css";

export const Modal = ({ className, isModalOpen, closeModal, children }: { className: string, isModalOpen: boolean, closeModal: () => void, children: ReactNode }) => {
    return (
        <>
            {isModalOpen && (
                <div className={`modal ${className}`}>
                    <div className="modal__box">
                        <button className="modal__cross-btn" onClick={closeModal}>
                            <img src={cross} alt="Закрыть" />
                        </button>
                        {children}
                    </div>
                </div>
            )}
        </>
    );
};