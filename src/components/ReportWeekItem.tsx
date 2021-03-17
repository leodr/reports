import ClipboardJS from "clipboard";
import clsx from "clsx";
import { format, setDay } from "date-fns";
import { de } from "date-fns/locale";
import { useCallback, useEffect, useRef, useState } from "react";
import { fetchMultipleRecords, FullReport } from "../api/fetchMultipleReports";
import { ReportWeek } from "../api/fetchReportList";
import { useExpandedItem } from "./OpenedAccordionProvider";

interface ReportWeekItemProps {
  id: number;
  week: ReportWeek;
  accessToken: string;
}

const ReportWeekItem: React.FC<ReportWeekItemProps> = ({
  id,
  week,
  accessToken,
}) => {
  const [reports, setReports] = useState<FullReport[]>();
  const { isExpanded, toggleExpansion } = useExpandedItem(id);
  const [shouldShowDate, setShouldShowDate] = useState(true);

  const [hasCopied, setHasCopied] = useState(false);

  const textRef = useRef<HTMLDivElement | null>(null);

  const clipboardRef = useRef<ClipboardJS>();

  useEffect(function fetchReports() {
    fetchMultipleRecords(accessToken, week.reports).then((reports) =>
      setReports([...reports].reverse())
    );
  }, []);

  useEffect(
    function updateShouldShowDate() {
      if (reports && reports.length >= 4) {
        setShouldShowDate(true);
      } else {
        setShouldShowDate(false);
      }
    },
    [reports]
  );

  useEffect(
    function removeHasCopied() {
      const timeout = window.setTimeout(() => {
        if (hasCopied) {
          setHasCopied(false);
        }
      }, 3_000);

      return () => window.clearTimeout(timeout);
    },
    [hasCopied, setHasCopied]
  );

  const attachClipboardJS = useCallback((node: HTMLDivElement | null) => {
    if (node !== null) {
      clipboardRef.current = new ClipboardJS(node);

      clipboardRef.current.on("success", () => {
        setHasCopied(true);
        window.getSelection()?.empty();
      });
    } else if (clipboardRef.current !== undefined) {
      clipboardRef.current.destroy();
    }
  }, []);

  const mondayOfWeek = setDay(week.startOfWeek, 1);

  const textId = `text_${id}`;

  return (
    <li>
      <div
        className={clsx(
          "rounded-md shadow bg-white divide-y divide-gray-200",
          !isExpanded &&
            "hover:shadow-lg focus:shadow-lg transition-shadow duration-150"
        )}
      >
        <div
          className="flex items-center justify-between px-4 py-3 space-y-1 rounded-md outline-none cursor-pointer select-none focus:ring"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === " " || event.key === "Enter") {
              event.preventDefault();
              toggleExpansion();
            }
          }}
          onClick={toggleExpansion}
        >
          <div className="space-y-1">
            {reports && (
              <span className="px-2 py-1 -ml-px text-xs font-medium tracking-wide text-indigo-700 uppercase bg-indigo-200 rounded-full">
                {`${reports.length} Berichte`}
              </span>
            )}
            <h4 className="text-lg font-bold">
              <time dateTime={mondayOfWeek.toString()}>
                {format(mondayOfWeek, "dd. MMMM", {
                  locale: de,
                })}
              </time>
            </h4>
          </div>
          <div>
            <svg
              className={clsx("w-6 h-6 transform", isExpanded && "rotate-180")}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
        </div>
        {isExpanded && (
          <div className="p-4 space-y-3">
            <div className="flex justify-between align-center">
              <label className="select-none">
                <input
                  type="checkbox"
                  name="Datum zeigen"
                  checked={shouldShowDate}
                  onChange={(event) => setShouldShowDate(event.target.checked)}
                />
                <span className="ml-2">Datum zeigen</span>
              </label>
              <div
                className={clsx(
                  "flex items-center space-x-2 select-none cursor-pointer outline-none focus:ring",
                  hasCopied ? "text-green-400" : "text-gray-400"
                )}
                tabIndex={0}
                data-clipboard-target={`#${textId}`}
                ref={attachClipboardJS}
              >
                {hasCopied ? (
                  <>
                    <span>Kopiert!</span>
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.1"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path>
                    </svg>
                  </>
                ) : (
                  <>
                    <span>Kopieren</span>
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.1"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"></path>
                    </svg>
                  </>
                )}
              </div>
            </div>
            <div
              className="p-3 space-y-3 border border-gray-200 border-dashed rounded bg-gray-50"
              id={textId}
              ref={textRef}
            >
              {reports?.map((report) => {
                const { creationTime, id, questions } = report;

                const firstQuestion = questions[0];

                return (
                  <p key={id}>
                    {shouldShowDate && (
                      <>
                        <span className="font-medium text-gray-800">
                          {format(new Date(creationTime), "EEEE, dd. MMM yy", {
                            locale: de,
                          })}
                          :
                        </span>
                        <br />
                      </>
                    )}
                    <span className="text-gray-600">
                      {firstQuestion.answer}
                    </span>
                  </p>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </li>
  );
};

export default ReportWeekItem;
