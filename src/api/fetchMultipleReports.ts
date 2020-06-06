import { fetchReport, Report } from './fetchReport';
import { ReportListEntry } from './fetchReportList';

export interface FullReport extends ReportListEntry {
    questions: Report;
}

export async function fetchMultipleRecords(
    accessToken: string,
    reportListEntries: ReportListEntry[]
) {
    const recordPromises: Array<Promise<FullReport>> = reportListEntries.map(
        async (entry) => ({
            ...entry,
            questions: await fetchReport(accessToken, entry.id),
        })
    );

    return await Promise.all(recordPromises);
}
