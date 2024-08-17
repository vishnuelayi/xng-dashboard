import session_date_filter_options, { SessionDateFilter } from "../data/get_session_date_filter_options";

export function getSessionDateFilterStringFromEnum(session_date_filter: SessionDateFilter)  {
 ;
    switch (session_date_filter) {
      case SessionDateFilter.NUMBER_0:
        return session_date_filter_options[0];
      case SessionDateFilter.NUMBER_1:
        return session_date_filter_options[1];
        // case SessionDateFilter.NUMBER_2:
        //   return session_date_filter_options[2];
      default:
        return session_date_filter_options[0];
    }
  }
  export function getSessionDateFilterEnumFromString(session_date_filter_string: string) {

    switch (session_date_filter_string) {
      case session_date_filter_options[0]:
        return SessionDateFilter.NUMBER_0;
      case session_date_filter_options[1]:
        return SessionDateFilter.NUMBER_1;
      // case session_date_filter_options[2]:
      //   return SessionDateFilter.NUMBER_2;

      default:
        return SessionDateFilter.NUMBER_0;
    }
  }
  