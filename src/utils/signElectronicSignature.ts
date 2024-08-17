import dayjs from "dayjs";
import { API_USERS } from "../api/api";
import { PatchElectronicSignatureRequest, StatementType } from "../profile-sdk";

export type SignatureData = {
  iod: string;
  ipAddress: string;
  fullName: string;
  state: string;
};

async function SignElectronicSignature(
  documentText: string,
  statementType: StatementType,
  data: SignatureData,
  debug?: boolean,
) {
  const patchElectronicSignatureRequest: PatchElectronicSignatureRequest = {
    isSigned: debug ? false : true,
    objectId: data.iod,
    requestIpAddress: data.ipAddress, // get IP
    signedOnDateLocal: dayjs().toDate(),
    signedByFullName: data.fullName.trim(),
    documentText: documentText,
  };
  await API_USERS.v1UsersIdElectronicSignaturesStatementTypePatch(
    data.iod,
    statementType,
    data.state,
    patchElectronicSignatureRequest,
  );
}

export default SignElectronicSignature;
