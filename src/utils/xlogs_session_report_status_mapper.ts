import { SessionStatus } from "@xng/reporting/dist/models";
import GetSessionReportStatusOptions from "../data/get_session_report_status_options";


export function GetSessionReportStatusStringFromEnum(session_report_status: SessionStatus){
    const session_report_status_options = GetSessionReportStatusOptions();

    switch (session_report_status) {
        case SessionStatus.NUMBER_0:
            return session_report_status_options[0];
        case SessionStatus.NUMBER_1:
            return session_report_status_options[1];
        case SessionStatus.NUMBER_2:
            return session_report_status_options[2];
        case SessionStatus.NUMBER_3:
            return session_report_status_options[3];
        case SessionStatus.NUMBER_4:
            return session_report_status_options[4];
        case SessionStatus.NUMBER_5:
            return session_report_status_options[5];
        default:
            return session_report_status_options[0];
    }
}

export function GetSessionReportStatusEnumFromString(session_report_status_string: string){
    const session_report_status_options = GetSessionReportStatusOptions();

    switch (session_report_status_string) {
        case session_report_status_options[0]:
            return SessionStatus.NUMBER_0;
        case session_report_status_options[1]:
            return SessionStatus.NUMBER_1;
        case session_report_status_options[2]:
            return SessionStatus.NUMBER_2;
        case session_report_status_options[3]:
            return SessionStatus.NUMBER_3;
        case session_report_status_options[4]:
            return SessionStatus.NUMBER_4;
        case session_report_status_options[5]:
            return SessionStatus.NUMBER_5;
        default:
            return SessionStatus.NUMBER_0;
    }
}