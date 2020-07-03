import { eachWeekOfInterval, isEqual, startOfWeek } from "date-fns";
import { getUserIdFromToken } from "../util/getUserIdFromToken";

function getReportListUrl(startDate: Date, endDate: Date, userId: number) {
  return `https://tapp01.tobit.com/Tapps/AbsenceBoard/V2.0/Alibi.Web.API/DailyReport/19/${userId}?reportIds=true&startTime=${startDate.toISOString()}&endTime=${endDate.toISOString()}`;
}

export interface ReportListEntry {
  creationTime: string;
  endTime: string;
  id: number;
  startTime: string;
}

export type ReportList = Array<ReportListEntry>;

export interface ReportWeek {
  startOfWeek: Date;
  reports: ReportListEntry[];
}

interface FetchReportListOptions {
  accessToken: string;
  startDate: Date;
  endDate: Date;
}

export async function fetchReportList({
  accessToken,
  startDate,
  endDate,
}: FetchReportListOptions): Promise<ReportWeek[]> {
  const userId = getUserIdFromToken(accessToken);

  const response = await fetch(getReportListUrl(startDate, endDate, userId), {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const list = (await response.json()) as ReportList;

  const tweenWeeks = eachWeekOfInterval({ start: startDate, end: endDate });

  const weekList = tweenWeeks.map((weekStart) => {
    return {
      startOfWeek: weekStart,
      reports: list.filter((e) =>
        isEqual(weekStart, startOfWeek(new Date(e.startTime)))
      ),
    };
  });

  return weekList;
}
