import {
  getChallenges,
  createChallenge,
  updateChallenge,
  deleteChallenge,
} from "../challenges";
import { supabase } from "../supabase";
import type { ChallengeFormData } from "@/types/challenge";

jest.mock("../supabase");

describe("Challenges API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getChallenges", () => {
    it("성공적으로 챌린지 목록을 가져와야 합니다", async () => {
      const mockChallenges = [
        { id: 1, name: "테스트 챌린지 1" },
        { id: 2, name: "테스트 챌린지 2" },
      ];

      (supabase.from as jest.Mock).mockImplementation((table) => {
        if (table === "Challenges") {
          return {
            select: jest.fn().mockReturnThis(),
            order: jest.fn().mockResolvedValue({
              data: mockChallenges,
              error: null,
            }),
          };
        }
        return {};
      });

      const result = await getChallenges();
      expect(result).toEqual(mockChallenges);
    });

    it("에러 발생 시 적절히 처리해야 합니다", async () => {
      (supabase.from as jest.Mock).mockImplementation((table) => {
        if (table === "Challenges") {
          return {
            select: jest.fn().mockReturnThis(),
            order: jest
              .fn()
              .mockRejectedValue(
                new Error("챌린지 목록 조회 중 오류가 발생했습니다."),
              ),
          };
        }
        return {};
      });

      await expect(getChallenges()).rejects.toThrow(
        "챌린지 목록 조회 중 오류가 발생했습니다.",
      );
    });
  });

  describe("createChallenge", () => {
    it("성공적으로 새로운 챌린지를 생성해야 합니다", async () => {
      const mockChallenge: ChallengeFormData = {
        name: "새로운 챌린지",
        open_date: "2024-03-20",
        close_date: "2024-04-20",
        lecture_num: 5,
      };

      const mockResponse = { id: 1, ...mockChallenge };
      (supabase.from as jest.Mock).mockImplementation((table) => {
        if (table === "Challenges") {
          return {
            insert: jest.fn().mockReturnThis(),
            select: jest.fn().mockReturnThis(),
            single: jest.fn().mockResolvedValue({
              data: mockResponse,
              error: null,
            }),
          };
        }
        return {};
      });

      const result = await createChallenge(mockChallenge);
      expect(result).toEqual(mockResponse);
    });
  });

  describe("updateChallenge", () => {
    it("성공적으로 챌린지를 수정해야 합니다", async () => {
      const mockUpdate: Partial<ChallengeFormData> = {
        name: "수정된 챌린지",
        open_date: "2024-03-20",
        close_date: "2024-04-20",
        lecture_num: 5,
      };

      const mockResponse = { id: 1, ...mockUpdate };
      const mockLectures = [
        { id: 1, sequence: 1 },
        { id: 2, sequence: 2 },
      ];

      (supabase.from as jest.Mock).mockImplementation((table) => {
        if (table === "Challenges") {
          return {
            update: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            select: jest.fn().mockReturnThis(),
            single: jest.fn().mockResolvedValue({
              data: mockResponse,
              error: null,
            }),
          };
        }
        if (table === "ChallengeLectures") {
          return {
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            order: jest.fn().mockResolvedValue({
              data: mockLectures,
              error: null,
            }),
            update: jest.fn().mockReturnThis(),
          };
        }
        return {};
      });

      const result = await updateChallenge(1, mockUpdate);
      expect(result).toEqual(mockResponse);
    });

    it("존재하지 않는 챌린지 수정 시 에러를 발생시켜야 합니다", async () => {
      (supabase.from as jest.Mock).mockImplementation((table) => {
        if (table === "Challenges") {
          return {
            update: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            select: jest.fn().mockReturnThis(),
            single: jest.fn().mockResolvedValue({
              data: null,
              error: null,
            }),
          };
        }
        return {};
      });

      await expect(
        updateChallenge(999, { name: "수정된 챌린지" }),
      ).rejects.toThrow("챌린지를 찾을 수 없습니다.");
    });
  });

  describe("deleteChallenge", () => {
    it("성공적으로 챌린지와 관련 강의를 삭제해야 합니다", async () => {
      (supabase.from as jest.Mock).mockImplementation((table) => {
        if (table === "ChallengeLectures") {
          return {
            delete: jest.fn().mockReturnThis(),
            eq: jest.fn().mockResolvedValue({ error: null }),
          };
        }
        if (table === "Challenges") {
          return {
            delete: jest.fn().mockReturnThis(),
            eq: jest.fn().mockResolvedValue({ error: null }),
          };
        }
        return {};
      });

      const result = await deleteChallenge(1);
      expect(result).toBe(true);
    });

    it("챌린지와 강의 삭제 중 에러 발생 시 적절히 처리해야 합니다", async () => {
      (supabase.from as jest.Mock).mockImplementation((table) => {
        if (table === "ChallengeLectures") {
          return {
            delete: jest.fn().mockReturnThis(),
            eq: jest.fn().mockResolvedValue({ error: null }),
          };
        }
        if (table === "Challenges") {
          return {
            delete: jest.fn().mockReturnThis(),
            eq: jest
              .fn()
              .mockRejectedValue(
                new Error("챌린지 삭제 중 오류가 발생했습니다."),
              ),
          };
        }
        return {};
      });

      await expect(deleteChallenge(1)).rejects.toThrow(
        "챌린지 삭제 중 오류가 발생했습니다.",
      );
    });
  });
});
