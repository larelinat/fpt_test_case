import s from "./Info.module.scss"
import RowInfo from "./RowInfo/RowInfo.tsx";
const Info = () => {
    return (
        <div className={s.info}>
            <RowInfo paramText={"Одобрить"} keyText={"Пробел"} color={"#88BD35"} />
            <RowInfo paramText={"Отклонить"} keyText={"Del"} color={"#F7992E"} />
            <RowInfo paramText={"Эскалация"} keyText={"Shift+Enter"} color={"#1764CC"} />
            <RowInfo paramText={"Сохранить"} keyText={"F7"} />
        </div>
    );
};

export default Info;