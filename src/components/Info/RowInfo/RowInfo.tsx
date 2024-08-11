import s from "./RowInfo.module.scss"

interface IRowInfoProps {
    paramText: string
    keyText: string
    color?: string
}
const RowInfo = (props: IRowInfoProps) => {
    return (
        <div className={s.row}>
            <div className={s.param}>{props.paramText}</div>
            <div
                className={s.circle}
                style={{background: props.color}}
            ></div>
            <div className={s.key}>{props.keyText}</div>
        </div>
    );
};

export default RowInfo;