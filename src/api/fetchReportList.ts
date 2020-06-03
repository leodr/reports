import { eachWeekOfInterval, isEqual, startOfWeek, subWeeks } from 'date-fns';

function getReportListUrl(startDate: Date, endDate: Date) {
    return `https://tapp01.tobit.com/Tapps/AbsenceBoard/V2.0/Alibi.Web.API/DailyReport/19/1948208?reportIds=true&startTime=${startDate.toISOString()}&endTime=${endDate.toISOString()}`;
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

export async function fetchReportList(
    accessToken: string
): Promise<ReportWeek[]> {
    const startDate = startOfWeek(subWeeks(new Date(), 2));
    const endDate = new Date();

    const response = await fetch(getReportListUrl(startDate, endDate), {
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
