import { supabase } from "../supabase";
import {
  createLecture,
  updateLecture,
  deleteLecture,
  getLectureDetail,
  getUserLectures,
  getLecturesByChallenge,
} from "../lectures";
import { UPLOAD_TYPE } from "@/constants/uploadTypes";
import { uploadFileToStorage, deleteStorageFile } from "@/utils/files";
import { validateAuth } from "@/utils/auth";

// Mock dependencies
jest.mock("../supabase");
jest.mock("@/utils/files");
jest.mock("@/utils/auth");

describe("Lectures API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createLecture", () => {
    const mockLectureData = {
      name: "테스트 강의",
      description: "테스트 설명",
      url: "https://example.com/video.mp4",
      upload_type: UPLOAD_TYPE.VIDEO,
      challenges: [1, 2],
      challengeOrders: [
        { challengeId: 1, order: 1 },
        { challengeId: 2, order: 2 },
      ],
      assignmentTitle: "테스트 과제",
      assignment: "과제 내용",
    };

    it("강의를 성공적으로 생성해야 합니다", async () => {
      (supabase.from as jest.Mock).mockImplementation((table) => {
        if (table === "Lectures") {
          return {
            insert: jest.fn().mockReturnThis(),
            select: jest.fn().mockReturnThis(),
            single: jest.fn().mockResolvedValue({
              data: { id: 1, name: "테스트 강의" },
              error: null,
            }),
          };
        }
        if (table === "Challenges") {
          return {
            select: jest.fn().mockReturnThis(),
            in: jest.fn().mockResolvedValue({
              data: [
                { id: 1, open_date: "2024-03-20" },
                { id: 2, open_date: "2024-03-20" },
              ],
              error: null,
            }),
          };
        }
        return {
          insert: jest.fn().mockResolvedValue({ error: null }),
        };
      });

      const result = await createLecture(mockLectureData);
      expect(result).toHaveProperty("id", 1);
      expect(validateAuth).toHaveBeenCalled();
    });

    it("파일 업로드가 있는 경우 스토리지에 업로드해야 합니다", async () => {
      const file = new File(["test"], "test.mp4", { type: "video/mp4" });
      const lectureDataWithFile = { ...mockLectureData, file };

      (supabase.from as jest.Mock).mockImplementation((table) => {
        if (table === "Lectures") {
          return {
            insert: jest.fn().mockReturnThis(),
            select: jest.fn().mockReturnThis(),
            single: jest.fn().mockResolvedValue({
              data: { id: 1, name: "테스트 강의" },
              error: null,
            }),
          };
        }
        if (table === "Challenges") {
          return {
            select: jest.fn().mockReturnThis(),
            in: jest.fn().mockResolvedValue({
              data: [
                { id: 1, open_date: "2024-03-20" },
                { id: 2, open_date: "2024-03-20" },
              ],
              error: null,
            }),
          };
        }
        return {
          insert: jest.fn().mockResolvedValue({ error: null }),
        };
      });

      await createLecture(lectureDataWithFile);
      expect(uploadFileToStorage).toHaveBeenCalledWith(file);
    });
  });

  describe("updateLecture", () => {
    const mockLectureData = {
      name: "수정된 강의",
      description: "수정된 설명",
      url: "https://example.com/updated-video.mp4",
      upload_type: UPLOAD_TYPE.VIDEO,
      challenges: [1, 2],
      challengeOrders: [
        { challengeId: 1, order: 1 },
        { challengeId: 2, order: 2 },
      ],
      assignmentTitle: "테스트 과제",
      assignment: "과제 내용",
    };

    it("강의를 성공적으로 수정해야 합니다", async () => {
      (supabase.from as jest.Mock).mockImplementation((table) => {
        if (table === "Lectures") {
          return {
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            single: jest.fn().mockResolvedValue({
              data: {
                id: 1,
                name: "테스트 강의",
                description: "테스트 설명",
                url: "https://example.com/video.mp4",
                upload_type: UPLOAD_TYPE.VIDEO,
                created_at: "2024-03-20T00:00:00Z",
                updated_at: "2024-03-20T00:00:00Z",
              },
              error: null,
            }),
            update: jest.fn().mockReturnThis(),
          };
        }
        if (table === "Challenges") {
          return {
            select: jest.fn().mockReturnThis(),
            in: jest.fn().mockResolvedValue({
              data: [
                { id: 1, open_date: "2024-03-20" },
                { id: 2, open_date: "2024-03-20" },
              ],
              error: null,
            }),
          };
        }
        if (table === "ChallengeLectures") {
          const mockMethods = {
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            single: jest.fn().mockResolvedValue({
              data: { id: 1 },
              error: null,
            }),
            update: jest.fn().mockReturnThis(),
            insert: jest.fn().mockResolvedValue({ error: null }),
          };
          mockMethods.eq.mockReturnThis();
          return mockMethods;
        }
        if (table === "Assignments") {
          const mockMethods = {
            update: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
          };
          mockMethods.eq.mockReturnThis();
          return mockMethods;
        }
        return {
          update: jest.fn().mockReturnThis(),
        };
      });

      const result = await updateLecture(1, mockLectureData);
      expect(result).toHaveProperty("id", 1);
      expect(result).toHaveProperty("name", "테스트 강의");
    });
  });

  describe("deleteLecture", () => {
    it("강의를 성공적으로 삭제해야 합니다", async () => {
      (supabase.from as jest.Mock).mockImplementation((table) => {
        if (table === "Lectures") {
          const mockMethods = {
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            single: jest.fn().mockResolvedValue({
              data: {
                url: "https://example.com/video.mp4",
                upload_type: UPLOAD_TYPE.VIDEO,
              },
              error: null,
            }),
            delete: jest.fn().mockReturnThis(),
          };
          mockMethods.eq.mockReturnThis();
          return mockMethods;
        }
        if (table === "ChallengeLectures") {
          const mockMethods = {
            delete: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
          };
          mockMethods.eq.mockReturnThis();
          return mockMethods;
        }
        if (table === "Assignments") {
          const mockMethods = {
            delete: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
          };
          mockMethods.eq.mockReturnThis();
          return mockMethods;
        }
        return {
          delete: jest.fn().mockReturnThis(),
        };
      });

      const result = await deleteLecture(1);
      expect(result).toHaveProperty("success", true);
      expect(deleteStorageFile).toHaveBeenCalled();
    });
  });

  describe("getLectureDetail", () => {
    it("강의 상세 정보를 성공적으로 조회해야 합니다", async () => {
      (supabase.from as jest.Mock).mockImplementation((table) => {
        if (table === "Lectures") {
          return {
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            maybeSingle: jest.fn().mockResolvedValue({
              data: {
                id: 1,
                name: "테스트 강의",
                description: "테스트 설명",
                url: "https://example.com/video.mp4",
                upload_type: UPLOAD_TYPE.VIDEO,
                created_at: "2024-03-20T00:00:00Z",
                updated_at: "2024-03-20T00:00:00Z",
                Assignments: [{ title: "테스트 과제", contents: "과제 내용" }],
                ChallengeLectures: [
                  {
                    id: 1,
                    sequence: 1,
                    Challenges: { id: 1, name: "테스트 챌린지" },
                  },
                ],
              },
              error: null,
            }),
          };
        }
        return {};
      });

      const result = await getLectureDetail(1);
      expect(result).toHaveProperty("id", 1);
      expect(result).toHaveProperty("name", "테스트 강의");
    });
  });

  describe("getUserLectures", () => {
    it("사용자의 강의 목록을 성공적으로 조회해야 합니다", async () => {
      (supabase.from as jest.Mock).mockImplementation((table) => {
        if (table === "ChallengeUsers") {
          return {
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockResolvedValue({
              data: [
                {
                  challenge_id: 1,
                  Challenges: {
                    id: 1,
                    open_date: "2024-03-20",
                    close_date: "2024-03-27",
                  },
                },
              ],
              error: null,
            }),
          };
        }
        return {
          select: jest.fn().mockReturnThis(),
          in: jest.fn().mockReturnThis(),
          order: jest.fn().mockResolvedValue({
            data: [{ Lectures: { id: 1, name: "테스트 강의" } }],
            error: null,
          }),
        };
      });

      (supabase.rpc as jest.Mock).mockResolvedValue({
        data: "2024-03-20T00:00:00Z",
        error: null,
      });

      const result = await getUserLectures(1);
      expect(result).toHaveLength(1);
      expect(result[0]).toHaveProperty("name", "테스트 강의");
    });
  });

  describe("getLecturesByChallenge", () => {
    it("챌린지별 강의 목록을 성공적으로 조회해야 합니다", async () => {
      (supabase.from as jest.Mock).mockImplementation((table) => {
        if (table === "ChallengeLectures") {
          return {
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            order: jest.fn().mockReturnThis(),
            returns: jest.fn().mockResolvedValue({
              data: [
                {
                  lecture_id: 1,
                  sequence: 1,
                  Lectures: {
                    id: 1,
                    name: "테스트 강의",
                    description: "테스트 설명",
                    url: "https://example.com/video.mp4",
                    upload_type: UPLOAD_TYPE.VIDEO,
                    created_at: "2024-03-20T00:00:00Z",
                    updated_at: "2024-03-20T00:00:00Z",
                    Assignments: [
                      {
                        title: "테스트 과제",
                        contents: "과제 내용",
                      },
                    ],
                  },
                },
              ],
              error: null,
            }),
          };
        }
        return {};
      });

      const result = await getLecturesByChallenge(1);
      expect(result).toHaveLength(1);
      expect(result[0]).toHaveProperty("name", "테스트 강의");
      expect(result[0]).toHaveProperty("sequence", 1);
    });
  });
});
