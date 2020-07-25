import clsx from "clsx";
import {
  addDays,
  endOfToday,
  startOfWeek,
  subDays,
  subWeeks,
  subYears,
} from "date-fns";
import Head from "next/head";
import { useState } from "react";
import { fetchReportList, ReportWeek } from "../src/api/fetchReportList";
import DatePicker from "../src/components/DatePicker";
import OpenedAccordionProvider from "../src/components/OpenedAccordionProvider";
import ReportWeekItem from "../src/components/ReportWeekItem";
import TokenInputField from "../src/components/TokenInputField";

export default function Home() {
  const [token, setToken] = useState<string>("");
  const [hasError, setHasError] = useState(false);
  const [reportList, setReportList] = useState<ReportWeek[]>();

  const [startDate, setStartDate] = useState(() =>
    startOfWeek(subWeeks(Date.now(), 2))
  );
  const [endDate, setEndDate] = useState(() => endOfToday());

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
      <header className="bg-white border-b border-gray-200 py-6 overflow-hidden">
        <div className="max-w-3xl px-5 mx-auto">
          <h1 className="text-4xl font-black leading-tight mt-4">
            Wochenberichte erstellen
          </h1>
          <p className="my-2">
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
            <div className="flex flex-col sm:flex-row mt-4 space-y-2 sm:space-y-0 flex-wrap sm:flex-no-wrap sm:space-x-2">
              <div className="flex-1">
                <h3 className="text-gray-500 uppercase tracking-wide text-sm font-medium">
                  Von
                </h3>
                <DatePicker
                  value={startDate}
                  onChange={setStartDate}
                  min={subYears(Date.now(), 1)}
                  max={subDays(endDate, 1)}
                />
              </div>
              <div className="flex-1">
                <h3 className="text-gray-500 uppercase tracking-wide text-sm font-medium">
                  Bis
                </h3>
                <DatePicker
                  value={endDate}
                  onChange={setEndDate}
                  min={addDays(startDate, 1)}
                  max={endOfToday()}
                />
              </div>
            </div>
            <div>
              <h3 className="text-gray-500 uppercase tracking-wide text-sm font-medium">
                tobit.com-accesstoken
              </h3>
              <div className="flex items-stretch space-x-2">
                <TokenInputField value={token} onChange={setToken} />
                <button
                  disabled={buttonDisabled}
                  className={clsx(
                    "px-4 bg-indigo-700 text-white rounded focus:shadow-outline-indigo outline-none hover:bg-indigo-800 transition-colors duration-75",
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
      <main className="max-w-3xl mx-auto my-4 px-4">
        {reportList && (
          <h2 className="text-sm uppercase tracking-wide font-medium mb-1 text-gray-600">{`${reportList.length} Wochenberichte erstellt`}</h2>
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
