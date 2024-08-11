import s from "./Content.module.scss"
import {useFarpost} from "../../hooks/useFarpost.ts";
import Card from "./Card/Card.tsx";
import {memo} from "react";
import Modal from "../../common/Modal.tsx";

const Content = () => {
    const {
        data,
        isLoading,
        modal,
        setRef,
        onElClick
    } = useFarpost();

    return (
        <div className={s.content}>
            {isLoading && <div>Loading...</div>}
            {data.map((item, index) => (
                <Card
                    item={item}
                    key={index}
                    onClick={onElClick}
                    ref={(el: HTMLDivElement | null) => setRef(index, el)}/>
            ))}
            {modal && (
                <Modal
                    message={modal.message}
                    type={modal.type}
                    onConfirm={modal.onConfirm}
                    onCancel={modal.onCancel}
                />
            )}
        </div>
    );
};

export default memo(Content);