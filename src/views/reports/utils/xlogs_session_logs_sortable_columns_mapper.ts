import { SessionLogsSortableColumn } from "@xng/reporting";
import session_logs_sortable_columns_keys from "../../../data/get_session_logs_sortable_columns_keys";

export function GetSessionLogsSortableColumnEnumFromString(key: string) {
  switch (key) {
    case session_logs_sortable_columns_keys[0]:
      return SessionLogsSortableColumn.NUMBER_0;
    case session_logs_sortable_columns_keys[1]:
      return SessionLogsSortableColumn.NUMBER_1;
    case session_logs_sortable_columns_keys[2]:
      return SessionLogsSortableColumn.NUMBER_2;
    case session_logs_sortable_columns_keys[3]:
      return SessionLogsSortableColumn.NUMBER_3;
    case session_logs_sortable_columns_keys[4]:
      return SessionLogsSortableColumn.NUMBER_4;
    case session_logs_sortable_columns_keys[5]:
      return SessionLogsSortableColumn.NUMBER_5;
    case session_logs_sortable_columns_keys[6]:
      return SessionLogsSortableColumn.NUMBER_6;
    case session_logs_sortable_columns_keys[7]:
      return SessionLogsSortableColumn.NUMBER_7;
    case session_logs_sortable_columns_keys[8]:
      return SessionLogsSortableColumn.NUMBER_8;
    case session_logs_sortable_columns_keys[9]:
      return SessionLogsSortableColumn.NUMBER_9;
    case session_logs_sortable_columns_keys[10]:
      return SessionLogsSortableColumn.NUMBER_10;
    case session_logs_sortable_columns_keys[11]:
      return SessionLogsSortableColumn.NUMBER_11;
    case session_logs_sortable_columns_keys[12]:
      return SessionLogsSortableColumn.NUMBER_12;
    case session_logs_sortable_columns_keys[13]:
      return SessionLogsSortableColumn.NUMBER_13;
    case session_logs_sortable_columns_keys[14]:
      return SessionLogsSortableColumn.NUMBER_14;
    case session_logs_sortable_columns_keys[15]:
      return SessionLogsSortableColumn.NUMBER_15;
    case session_logs_sortable_columns_keys[16]:
      return SessionLogsSortableColumn.NUMBER_16;
    case session_logs_sortable_columns_keys[17]:
      return SessionLogsSortableColumn.NUMBER_17;
    case session_logs_sortable_columns_keys[18]:
      return SessionLogsSortableColumn.NUMBER_18;
    case session_logs_sortable_columns_keys[19]:
      return SessionLogsSortableColumn.NUMBER_19;
    case session_logs_sortable_columns_keys[20]:
      return SessionLogsSortableColumn.NUMBER_20;
    case session_logs_sortable_columns_keys[21]:
      return SessionLogsSortableColumn.NUMBER_21;
    case session_logs_sortable_columns_keys[22]:
      return SessionLogsSortableColumn.NUMBER_22;
    case session_logs_sortable_columns_keys[23]:
      return SessionLogsSortableColumn.NUMBER_23;
    case session_logs_sortable_columns_keys[24]:
      return SessionLogsSortableColumn.NUMBER_24;
    case session_logs_sortable_columns_keys[25]:
      return SessionLogsSortableColumn.NUMBER_25;
    case session_logs_sortable_columns_keys[26]:
      return SessionLogsSortableColumn.NUMBER_26;
    case session_logs_sortable_columns_keys[27]:
      return SessionLogsSortableColumn.NUMBER_27;

    default:
      return SessionLogsSortableColumn.NUMBER_0;
  }
}

export function GetSessionLogsSortableColumnStringFromEnum(column: SessionLogsSortableColumn) {
  switch (column) {
    case SessionLogsSortableColumn.NUMBER_0:
      return session_logs_sortable_columns_keys[0];
    case SessionLogsSortableColumn.NUMBER_1:
      return session_logs_sortable_columns_keys[1];
    case SessionLogsSortableColumn.NUMBER_2:
      return session_logs_sortable_columns_keys[2];
    case SessionLogsSortableColumn.NUMBER_3:
      return session_logs_sortable_columns_keys[3];
    case SessionLogsSortableColumn.NUMBER_4:
      return session_logs_sortable_columns_keys[4];
    case SessionLogsSortableColumn.NUMBER_5:
      return session_logs_sortable_columns_keys[5];
    case SessionLogsSortableColumn.NUMBER_6:
      return session_logs_sortable_columns_keys[6];
    case SessionLogsSortableColumn.NUMBER_7:
      return session_logs_sortable_columns_keys[7];
    case SessionLogsSortableColumn.NUMBER_8:
      return session_logs_sortable_columns_keys[8];
    case SessionLogsSortableColumn.NUMBER_9:
      return session_logs_sortable_columns_keys[9];
    case SessionLogsSortableColumn.NUMBER_10:
      return session_logs_sortable_columns_keys[10];
    case SessionLogsSortableColumn.NUMBER_11:
      return session_logs_sortable_columns_keys[11];
    case SessionLogsSortableColumn.NUMBER_12:
      return session_logs_sortable_columns_keys[12];
    case SessionLogsSortableColumn.NUMBER_13:
      return session_logs_sortable_columns_keys[13];
    case SessionLogsSortableColumn.NUMBER_14:
      return session_logs_sortable_columns_keys[14];
    case SessionLogsSortableColumn.NUMBER_15:
      return session_logs_sortable_columns_keys[15];
    case SessionLogsSortableColumn.NUMBER_16:
      return session_logs_sortable_columns_keys[16];
    case SessionLogsSortableColumn.NUMBER_17:
      return session_logs_sortable_columns_keys[17];
    case SessionLogsSortableColumn.NUMBER_18:
      return session_logs_sortable_columns_keys[18];
    case SessionLogsSortableColumn.NUMBER_19:
      return session_logs_sortable_columns_keys[19];
    case SessionLogsSortableColumn.NUMBER_20:
      return session_logs_sortable_columns_keys[20];
    case SessionLogsSortableColumn.NUMBER_21:
      return session_logs_sortable_columns_keys[21];
    case SessionLogsSortableColumn.NUMBER_22:
      return session_logs_sortable_columns_keys[22];
    case SessionLogsSortableColumn.NUMBER_23:
      return session_logs_sortable_columns_keys[23];
    case SessionLogsSortableColumn.NUMBER_24:
      return session_logs_sortable_columns_keys[24];
    case SessionLogsSortableColumn.NUMBER_25:
      return session_logs_sortable_columns_keys[25];
    case SessionLogsSortableColumn.NUMBER_26:
      return session_logs_sortable_columns_keys[26];
    case SessionLogsSortableColumn.NUMBER_27:
      return session_logs_sortable_columns_keys[27];
    default:
      return session_logs_sortable_columns_keys[0];
  }
}
