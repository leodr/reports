import { getUserIdFromToken } from '../util/getUserIdFromToken';

interface ReportQuestion {
    text: string;
    answer: string;
    imageUrl: string | null;
}

export type Report = Array<ReportQuestion>;

export async function fetchReport(accessToken: string, id: number) {
    const userId = getUserIdFromToken(accessToken);

    const response = await fetch(getReportUrl(id, userId), {
        headers: { Authorization: `Bearer ${accessToken}` },
    });

    const report = (await response.json()) as Report;

    const sanitizedReport: Report = report.map((question) => ({
        ...question,
        answer: question.answer.replace(removeTagsRegex, ''),
    }));

    return sanitizedReport;
}

function getReportUrl(id: number, userId: number) {
    return `https://tapp01.tobit.com/Tapps/AbsenceBoard/V2.0/Alibi.Web.API/DailyReport/19/${userId}?reportId=${id}`;
}

const removeTagsRegex = /<\/?[a-z ]*>/gi;
