
/* Enum: Scheduled = 0, InProgress = 1, AwaitingApproval = 2, RevisionsRequested = 3, Posted = 4, Closed = 5
* @export
*/
// export declare const SessionStatus: {
//    readonly NUMBER_0: 0;
//    readonly NUMBER_1: 1;
//    readonly NUMBER_2: 2;
//    readonly NUMBER_3: 3;
//    readonly NUMBER_4: 4;
//    readonly NUMBER_5: 5;
// };

export default function GetSessionReportStatusOptions(){
    return ["Scheduled", "InProgress", "AwaitingApproval", "RevisionsRequested", "Posted", "Closed"]
}