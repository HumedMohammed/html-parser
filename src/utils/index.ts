import { apiPath } from "@/constants";

export const getFilePreview = ({
  fileName,
  collectionName,
  recordId,
}: {
  fileName: string;
  collectionName: string;
  recordId: string;
}) => {
  return `${apiPath}/api/files/${collectionName}/${recordId}/${fileName}`;
};
