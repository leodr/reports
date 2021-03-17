import clsx from "clsx";
import {
  addDays,
  endOfDay,
  startOfWeek,
  subDays,
  subWeeks,
  subYears,
} from "date-fns";
import Head from "next/head";
import { useEffect, useState } from "react";
import { fetchReportList, ReportWeek } from "../src/api/fetchReportList";
import DatePicker from "../src/components/DatePicker";
import OpenedAccordionProvider from "../src/components/OpenedAccordionProvider";
import ReportWeekItem from "../src/components/ReportWeekItem";
import TokenInputField from "../src/components/TokenInputField";

export default function Home() {
  const [token, setToken] = useState<string>("");
  const [hasError, setHasError] = useState(false);
  const [reportList, setReportList] = useState<ReportWeek[]>();

  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const [startDate, setStartDate] = useState(() =>
    startOfWeek(subWeeks(now, 8))
  );
  const [endDate, setEndDate] = useState(() => endOfDay(now));

  useEffect(() => {
    setStartDate(startOfWeek(subWeeks(Date.now(), 8)));
    setEndDate(endOfDay(Date.now()));
  }, []);

  function handleRequest() {
    fetchReportList({ accessToken: token, startDate, endDate })
      .then((list) => {
        setHasError(false);
        setReportList(list);
      })
      .catch(() => setHasError(true));
  }

  const buttonDisabled = !token;

  return (
    <>
      <Head>
        <title>Wochenberichte erstellen</title>
      </Head>
      <header className="py-6 overflow-hidden bg-white border-b border-gray-200">
        <div className="max-w-3xl px-5 mx-auto">
          <h1 className="mt-8 text-5xl font-black text-gray-800 leading-tight text-center leading-none">
            Wochenberichte Erstellen
          </h1>
          <p className="mt-8 mb-16 text-gray-500 text-center text-lg">
            Dieses Tool generiert automatisch Wochenberichte aus Tagesberichten
            von{" "}
            <a
              href="https://labs.tobit.com"
              className="text-indigo-700 outline-none focus:underline hover:underline"
              rel="noopener noreferrer"
              target="_blank"
            >
              labs.tobit.com
            </a>
            , welche dann im{" "}
            <a
              href="https://www.bildung-ihk-nordwestfalen.de/tibrosBB/BB_auszubildende.jsp"
              className="text-indigo-700 outline-none focus:underline hover:underline"
              rel="noopener noreferrer"
              target="_blank"
            >
              IHK Online-Portal
            </a>{" "}
            eingereicht werden können.
          </p>
          <div className="space-y-3">
            <div className="flex flex-col flex-wrap mt-4 space-y-2 sm:flex-row sm:space-y-0 sm:flex-nowrap sm:space-x-2">
              <div className="flex-1">
                <h3 className="text-sm font-medium tracking-wide text-gray-500 uppercase">
                  Von
                </h3>
                <DatePicker
                  value={startDate}
                  onChange={setStartDate}
                  min={subYears(now, 1)}
                  max={subDays(endDate, 1)}
                />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium tracking-wide text-gray-500 uppercase">
                  Bis
                </h3>
                <DatePicker
                  value={endDate}
                  onChange={setEndDate}
                  min={addDays(startDate, 1)}
                  max={endOfDay(now)}
                />
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium tracking-wide text-gray-500 uppercase">
                tobit.com-accesstoken
              </h3>
              <div className="flex items-stretch space-x-2">
                <TokenInputField value={token} onChange={setToken} />
                <button
                  disabled={buttonDisabled}
                  className={clsx(
                    "px-4 bg-indigo-500 text-white rounded focus:ring outline-none hover:bg-indigo-600 transition-colors duration-75",
                    buttonDisabled && "opacity-50 cursor-not-allowed"
                  )}
                  onClick={handleRequest}
                >
                  Anfragen
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-3xl px-4 mx-auto my-4">
        {reportList && (
          <h2 className="mb-1 text-sm font-medium tracking-wide text-gray-600 uppercase">{`${reportList.length} Wochenberichte erstellt`}</h2>
        )}
        <ul className="space-y-4">
          <OpenedAccordionProvider>
            {reportList?.map((week) => (
              <ReportWeekItem
                week={week}
                accessToken={token}
                id={week.reports[0]?.id ?? week.startOfWeek.toISOString()}
                key={week.reports[0]?.id ?? week.startOfWeek.toISOString()}
              />
            ))}
          </OpenedAccordionProvider>
        </ul>
      </main>
    </>
  );
}
