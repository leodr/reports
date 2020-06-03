import clsx from 'clsx';
import { useState } from 'react';
import { fetchReportList, ReportWeek } from '../src/api/fetchReportList';
import TokenInputField from '../src/components/TokenInputField';

export default function Home() {
    const [token, setToken] = useState<string>('');
    const [hasError, setHasError] = useState(false);
    const [reportList, setReportList] = useState<ReportWeek[]>();

    function handleRequest() {
        fetchReportList(token)
            .then((list) => {
                setHasError(false);
                console.log(list);
                setReportList(list);
            })
            .catch(() => setHasError(true));
    }

    const buttonDisabled = !token;

    return (
        <>
            <header className="bg-white border-b border-gray-200 py-6">
                <div className="container px-5">
                    <h1 className="text-4xl font-extrabold leading-tight mt-4">
                        Tagesberichte-Tool
                    </h1>
                    <h2>
                        Dieses Tool fasst Deine Tagesberichte von{' '}
                        <a
                            href="https://tobit.com"
                            className="text-indigo-700 outline-none focus:underline hover:underline"
                            rel="noopener noreferrer"
                            target="_blank"
                        >
                            tobit.com
                        </a>{' '}
                        automatisch als Wochenberichte zusammen, welche du dann
                        im{' '}
                        <a
                            href="https://www.bildung-ihk-nordwestfalen.de/tibrosBB/BB_auszubildende.jsp"
                            className="text-indigo-700 outline-none focus:underline hover:underline"
                            rel="noopener noreferrer"
                            target="_blank"
                        >
                            IHK Online-Portal
                        </a>{' '}
                        einreichen kannst.
                    </h2>
                    <div className="flex items-stretch space-x-2 pt-5">
                        <TokenInputField value={token} onChange={setToken} />
                        <button
                            disabled={buttonDisabled}
                            className={clsx(
                                'px-4 bg-indigo-700 text-white rounded focus:shadow-outline-indigo outline-none',
                                buttonDisabled &&
                                    'opacity-50 cursor-not-allowed'
                            )}
                            onClick={handleRequest}
                        >
                            Anfragen
                        </button>
                    </div>
                </div>
            </header>
            <main>
                {reportList?.map((week) => (
                    <ReportWeekItem week={week} accessToken={token} />
                ))}
            </main>
        </>
    );
}

interface ReportWeekItemProps {
    week: ReportWeek;
    accessToken: string;
}

const ReportWeekItem: React.FC<ReportWeekItemProps> = ({
    week,
    accessToken,
}) => {
    return <div>{week.startOfWeek.toLocaleDateString()}</div>;
};
