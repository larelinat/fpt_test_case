import s from "./CardContent.module.scss"

interface ICardContentProps {
    bulletinSubject: string;
    bulletinText: string;
    bulletinImagees: string[];
}

const CardContent = (props: ICardContentProps) => {
    return (
        <div className={s.content}>
            <span className={s.header}>{props.bulletinSubject}</span>
            <div className={s.description}>
                <span className={s.text}>{props.bulletinText}</span>
                <div className={s.divider}/>
                <div className={s.pictures}>
                    {props.bulletinImagees.map((image, index) => {
                        return <img key={index} src={image} alt="bulletin" className={s.pic}/>
                    })}
                </div>
            </div>
        </div>
    );
};

export default CardContent;