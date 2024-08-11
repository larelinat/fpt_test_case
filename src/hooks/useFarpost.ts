import {useEffect, useRef, useState, useCallback} from "react";

export interface IAdvFromServer {
    id: number;
    publishDate: number;
    publishDateString: string;
    ownerId: number;
    ownerLogin: string;
    bulletinSubject: string;
    bulletinText: string;
    bulletinImagees: string[];
}

interface IAdvApproved extends IAdvFromServer {
    status: string;
}

interface IAdvDeclined extends IAdvApproved {
    reason: string;
}

interface IAdvEscalated extends IAdvApproved {
    note: string;
}

type IAdvProcessed = IAdvApproved | IAdvDeclined | IAdvEscalated;

export const useFarpost = () => {
    const [data, setData] = useState([] as IAdvFromServer[]);
    const [dataProcessed, setDataProcessed] = useState([] as IAdvProcessed[]);

    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);

    const [start, setStart] = useState(0);
    const [selected, setSelected] = useState<number | null>(null);
    const [init, setInit] = useState(false);

    const [modal, setModal] = useState<{
        message: string,
        type?: string,
        onConfirm: (input: string) => void,
        onCancel: () => void
    } | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const limit = 10;

    const advRefs = useRef<(HTMLDivElement | null)[]>([]);

    const setRef = useCallback((index: number, ref: HTMLDivElement | null) => {
        advRefs.current[index] = ref;
    }, []);

    const setSelectedCard = useCallback((id: number) => {
        advRefs.current.forEach(ref => {
            if (ref) {
                ref.classList.remove('focused');
            }
        });
        const index = data.findIndex(item => item.id === id);
        advRefs.current[index]?.classList.add('focused');
        advRefs.current[index]?.scrollIntoView({behavior: 'smooth', block: 'start', inline: 'start'});
        setSelected(id);
    }, [data]);

    const selectNext = useCallback((color: string) => {
        if (selected !== null) {
            const index = data.findIndex(item => item.id === selected);
            const nextIndex = index + 1;
            if (index !== -1) {
                advRefs.current[index]?.style.setProperty('--card-bg', color);
            }
            if (nextIndex < data.length) {
                setSelectedCard(data[nextIndex].id);
            }
        }
    }, [data, selected, setSelectedCard]);

    const getData = useCallback(async () => {
        setIsLoading(true);
        setIsError(false);
        try {
            const response = await fetch(`http://localhost:3000/ads?_start=${start}&_limit=${limit}`);
            const data: IAdvFromServer[] = await response.json();
            setData(data);
        } catch (e) {
            console.log(e);
            setIsError(true);
        } finally {
            setIsLoading(false);
            setStart(prevStart => prevStart + 10);
        }
    }, [start]);

    const sendData = useCallback(async () => {
        if (data.length === dataProcessed.length) {
            setIsLoading(true);
            setIsError(false);
            console.log(dataProcessed);
            try {
                await fetch(`http://localhost:3000/managed`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(dataProcessed)
                });
                setData([]);
                setDataProcessed([]);
                await getData();
            } catch (e) {
                console.log(e);
                setIsError(true);
            } finally {
                setIsLoading(false);
            }
        }
    }, [data, dataProcessed, getData]);

    const processData = useCallback((id: number, newData: object) => {
        const adv = data.find((item: IAdvFromServer) => item.id === id);
        if (adv) {
            const procAdv = dataProcessed.find((item: IAdvProcessed) => item.id === id);
            if (procAdv) {
                setDataProcessed(prevDataProcessed => [
                    ...prevDataProcessed.filter(item => item.id !== id),
                    {...adv, ...newData} as IAdvProcessed
                ]);
            } else {
                setDataProcessed([...dataProcessed, {...adv, ...newData} as IAdvProcessed]);
            }
        }
    }, [data, dataProcessed]);

    const approve = useCallback((id: number) => {
        processData(id, {status: 'approved'});
        selectNext('#88BD35');
    }, [processData, selectNext]);

    const decline = useCallback((id: number) => {
        const adv = data.find((item: IAdvFromServer) => item.id === id);
        if (adv) {
            setIsModalOpen(true);
            setModal({
                message: 'Введите причину отклонения',
                type: 'decline',
                onConfirm: (reason: string) => {
                    processData(id, {status: 'declined', reason: reason});
                    setModal(null);
                    selectNext("#F7992E");
                    setIsModalOpen(false);
                },
                onCancel: () => {
                    setIsModalOpen(false);
                    setModal(null);
                }
            });
        }
    }, [data, processData, selectNext]);

    const escalate = useCallback((id: number) => {
        const adv = data.find((item: IAdvFromServer) => item.id === id);
        if (adv) {
            setIsModalOpen(true);
            setModal({
                message: 'Заметка для старшего модератора',
                onConfirm: (note: string) => {
                    processData(id, {status: 'escalated', note: note});
                    setModal(null);
                    selectNext('#1764CC');
                    setIsModalOpen(false);
                },
                onCancel: () => {
                    setIsModalOpen(false);
                    setModal(null);
                }
            });
        }
    }, [data, processData, selectNext]);


    const handleKeyPress = useCallback(async (e: KeyboardEvent) => {
        if (!isModalOpen) {
            switch (e.key) {
                case 'Enter':
                    if (e.shiftKey) {
                        if (selected) {
                            e.preventDefault();
                            escalate(selected);
                        }
                    } else {
                        if (!init) {
                            e.preventDefault();
                            await getData();
                            setInit(true);
                        }
                    }
                    break;
                case ' ':
                    if (selected) {
                        e.preventDefault();
                        approve(selected);
                    }
                    break;
                case 'Delete':
                    if (selected) {
                        e.preventDefault();
                        decline(selected);
                    }
                    break;
                case 'F7':
                    e.preventDefault();
                    if (data.length === dataProcessed.length) await sendData();
                    break;
                default:
                    break;
            }
        }
    }, [isModalOpen, selected, escalate, init, getData, approve, decline, data, dataProcessed, sendData]);

    const onElClick = useCallback((id: number) => {
        if (!isModalOpen) setSelectedCard(id);
    }, [isModalOpen, setSelectedCard]);

    useEffect(() => {
        setSelectedCard(data[0]?.id);
    }, [data, setSelectedCard]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyPress);
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        }
    }, [handleKeyPress]);

    useEffect(() => {
        if (isError) {
            alert('Ошибка загрузки данных');
        }
    }, [isError]);

    return {
        data,
        isLoading,
        modal,
        setRef,
        onElClick
    }
}