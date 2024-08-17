import GetParticipantListInfoOptions from "../data/get_participant_list_info_options";
import { ParticipationListStatusType } from "../profile-sdk";

export function getGetParticipantListStringFromEnum(getParticipantList: ParticipationListStatusType)  {
    const participantListOptions = GetParticipantListInfoOptions();
    switch (getParticipantList) {
      case ParticipationListStatusType.NUMBER_0:
        return participantListOptions[0];
      case ParticipationListStatusType.NUMBER_1:
        return participantListOptions[1];
      case ParticipationListStatusType.NUMBER_2:
        return participantListOptions[2];
      case ParticipationListStatusType.NUMBER_3:
        return participantListOptions[3];
      case ParticipationListStatusType.NUMBER_4:
        return participantListOptions[4];
      default:
        return participantListOptions[0];
    }
  }
  export function getGetParticipantListEnumFromString(getParticipantListString: string) {
    const participantListOptions = GetParticipantListInfoOptions();
    switch (getParticipantListString) {
      case participantListOptions[0]:
        return ParticipationListStatusType.NUMBER_0;
      case participantListOptions[1]:
        return ParticipationListStatusType.NUMBER_1;
      case participantListOptions[2]:
        return ParticipationListStatusType.NUMBER_2;
      case participantListOptions[3]:
        return ParticipationListStatusType.NUMBER_3;
      case participantListOptions[4]:
        return ParticipationListStatusType.NUMBER_4;
      default:
        return ParticipationListStatusType.NUMBER_0;
    }
  }
  