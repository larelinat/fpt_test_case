import {useEffect, useRef, useState} from "react";
import s from "./Modal.module.scss";

interface IModalProps {
    type?: string;
    message: string;
    onConfirm: (input: string) => void;
    onCancel: () => void;
}
const Modal = (props: IModalProps) => {
    const [input, setInput] = useState('');
    const dialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        if (dialogRef.current) {
            dialogRef.current.showModal();
        }
    }, []);

    const handleConfirm = () => {
        if(input.trim() === '' && props.type === 'decline') {
            return;
        }
        props.onConfirm(input);
        if (dialogRef.current) {
            dialogRef.current.close();
        }
    }

    const handleCancel = () => {
        props.onCancel();
        if (dialogRef.current) {
            dialogRef.current.close();
        }
    };

    return (
        <dialog ref={dialogRef} className={s.modal}>
            <h3 className={s.header}>{props.message}</h3>
            <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className={s.textarea}
            />
            <div className={s.buttons}>
                <button onClick={handleConfirm}>Подтвердить</button>
                <button onClick={handleCancel}>Отменить</button>
            </div>
        </dialog>
    );
};

export default Modal;