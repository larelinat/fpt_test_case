import s from "./CardHeader.module.scss"
import pic from "./Vector.png"

interface ICardHeaderProps {
    id: number;
    publishDateString: string;
    ownerLogin: string;
}
const CardHeader = (props: ICardHeaderProps) => {
    return (
        <div className={s.card_header}>
            <div className={s.left}>
                <span className={s.id}>{props.id}</span>
                <span>—</span>
                <span>{props.publishDateString}</span>
            </div>
            <div className={s.right}>
                <img className={s.pic} src={pic} alt={'human'}/>
                <span className={s.user}>{props.ownerLogin}</span>
            </div>
        </div>
    );
};

export default CardHeader;