import CardHeader from "./CardHeader/CardHeader.tsx";
import CardContent from "./CardContent/CardContent.tsx";
import s from "./Card.module.scss"
import {IAdvFromServer} from "../../../hooks/useFarpost.ts";
import {forwardRef} from "react";

interface ICardProps {
    item: IAdvFromServer;
    onClick: (id: number) => void;
}

const Card = forwardRef<HTMLDivElement, ICardProps>(({item, onClick}, ref) => {
    return (
        <div className={s.card} onClick={() => onClick(item.id)} ref={ref}>
            <CardHeader
                id={item.id}
                publishDateString={item.publishDateString}
                ownerLogin={item.ownerLogin}
            />
            <CardContent
                bulletinSubject={item.bulletinSubject}
                bulletinText={item.bulletinText}
                bulletinImagees={item.bulletinImagees}
            />
        </div>
    );
});

export default Card;