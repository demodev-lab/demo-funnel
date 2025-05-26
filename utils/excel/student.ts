import * as XLSX from "xlsx";
import { type Student } from "@/hooks/useStudents";

export const parseExcelFile = async (
  file: File,
): Promise<Array<Omit<Student, "id">>> => {
  const data = await file.arrayBuffer();
  const workbook = XLSX.read(data, { type: "array" });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const json: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

  if (!json.length) {
    throw new Error("엑셀 데이터가 비어 있습니다.");
  }

  const [header, ...rows] = json;
  if (
    !Array.isArray(header) ||
    header.length !== 3 ||
    header[0] !== "name" ||
    header[1] !== "email" ||
    header[2] !== "phone"
  ) {
    throw new Error("엑셀 양식이 올바르지 않습니다. 헤더를 확인해주세요.");
  }

  const studentsToAdd = rows
    .filter((row) => row.length >= 3 && row[0] && row[1] && row[2])
    .map((row) => ({
      name: String(row[0]),
      email: String(row[1]),
      phone: String(row[2]),
    }));

  if (!studentsToAdd.length) {
    throw new Error("추가할 학생 데이터가 없습니다.");
  }

  return studentsToAdd;
};
