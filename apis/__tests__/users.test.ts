import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getChallengeUsers,
  getStudentSubmissions,
} from "../users";
import { supabase } from "../supabase";
import { getUserChallenges } from "../challenges";

jest.mock("../supabase", () => ({
  supabase: {
    from: jest.fn(),
  },
}));

const mockFrom = supabase.from as jest.Mock;

describe("apis/users", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getUsers", () => {
    it("should return users data", async () => {
      mockFrom.mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: [{ id: 1 }], error: null }),
      });
      const result = await getUsers();
      expect(result).toEqual([{ id: 1 }]);
    });

    it("should return [] on error", async () => {
      mockFrom.mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: [], error: null }),
      });
      const result = await getUsers();
      expect(result).toEqual([]);
    });
  });

  describe("createUser", () => {
    it("should create user and insert challenges", async () => {
      mockFrom
        .mockReturnValueOnce({
          insert: jest.fn().mockReturnThis(),
          select: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ data: { id: 1 }, error: null }),
        })
        .mockReturnValueOnce({
          insert: jest.fn().mockResolvedValue({ error: null }),
        });
      const result = await createUser({
        id: 1,
        name: "test",
        email: "test@example.com",
        phone: "010-0000-0000",
        challenges: [1, 2],
      });
      expect(result).toEqual({ id: 1 });
    });

    it("should return null on error", async () => {
      mockFrom
        .mockReturnValueOnce({
          insert: jest.fn().mockReturnThis(),
          select: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ data: { id: 1 }, error: null }),
        })
        .mockReturnValueOnce({
          insert: jest.fn().mockResolvedValue({ error: null }),
        });
      const result = await createUser({
        id: 1,
        name: "test",
        email: "test@example.com",
        phone: "010-0000-0000",
        challenges: [1],
      });
      expect(result).toBeNull();
    });
  });

  describe("updateUser", () => {
    it("should update user and challenges", async () => {
      mockFrom
        .mockReturnValueOnce({
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ data: { id: 1 }, error: null }),
        })
        .mockReturnValueOnce({
          update: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          select: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ data: { id: 1 }, error: null }),
        })
        .mockReturnValueOnce({
          delete: jest.fn().mockReturnThis(),
          eq: jest.fn().mockResolvedValue({ error: null }),
        })
        .mockReturnValueOnce({
          insert: jest.fn().mockResolvedValue({ error: null }),
        });
      const result = await updateUser({
        id: 1,
        name: "test",
        email: "test@example.com",
        phone: "010-0000-0000",
        challenges: [1, 2],
      });
      expect(result).toEqual({ id: 1 });
    });

    it("should return null if user not found", async () => {
      mockFrom.mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: null, error: null }),
      });
      const result = await updateUser({
        id: 1,
        name: "test",
        email: "test@example.com",
        phone: "010-0000-0000",
      });
      expect(result).toBeNull();
    });
  });

  describe("deleteUser", () => {
    it("should delete user and related challenges", async () => {
      mockFrom
        .mockReturnValueOnce({
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ data: { id: 1 }, error: null }),
        })
        .mockReturnValueOnce({
          delete: jest.fn().mockReturnThis(),
          eq: jest.fn().mockResolvedValue({ error: null }),
        })
        .mockReturnValueOnce({
          delete: jest.fn().mockReturnThis(),
          eq: jest.fn().mockResolvedValue({ error: null }),
        });
      const result = await deleteUser(1);
      expect(result).toEqual({ success: true });
    });

    it("should return { success: false } on error", async () => {
      mockFrom.mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: null, error: null }),
      });
      const result = await deleteUser(1);
      expect(result).toEqual({ success: false });
    });
  });

  describe("getUserChallenges", () => {
    it("should return user challenges", async () => {
      mockFrom.mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({
          data: [
            { Challenges: { id: 1, name: "A" } },
            { Challenges: { id: 2, name: "B" } },
          ],
          error: null,
        }),
      });
      const result = await getUserChallenges(1);
      expect(result).toEqual([
        { id: 1, name: "A" },
        { id: 2, name: "B" },
      ]);
    });

    it("should return [] on error", async () => {
      mockFrom.mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({ data: [], error: null }),
      });
      const result = await getUserChallenges(1);
      expect(result).toEqual([]);
    });
  });

  describe("getChallengeUsers", () => {
    it("should return challenge users", async () => {
      mockFrom.mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({
          data: [
            { Users: { id: 1, name: "A", email: "a", phone: "1" } },
            { Users: { id: 2, name: "B", email: "b", phone: null } },
          ],
          error: null,
        }),
      });
      const result = await getChallengeUsers(1);
      expect(result).toEqual([
        { id: 1, name: "A", email: "a", phone: "1" },
        { id: 2, name: "B", email: "b", phone: "" },
      ]);
    });

    it("should return [] on error", async () => {
      mockFrom.mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: [], error: null }),
      });
      const result = await getChallengeUsers(1);
      expect(result).toEqual([]);
    });
  });

  describe("getStudentSubmissions", () => {
    it("should return student submissions", async () => {
      // ChallengeUsers
      mockFrom.mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({
          data: [
            { user_id: 1, Users: { name: "A", email: "a" } },
            { user_id: 2, Users: { name: "B", email: "b" } },
          ],
          error: null,
        }),
      });
      // ChallengeLectures
      mockFrom.mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({
          data: [
            { id: 10, lecture_id: 100 },
            { id: 11, lecture_id: 101 },
          ],
          error: null,
        }),
      });
      // Submissions for user 1, lecture 10
      const eqMock1 = jest.fn().mockReturnThis();
      const eqMock2 = jest.fn().mockResolvedValue({
        data: [
          {
            is_submit: true,
            assignment_url: "url1",
            assignment_comment: "c1",
          },
        ],
        error: null,
      });
      mockFrom.mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        eq: eqMock1,
      });
      eqMock1.mockReturnValueOnce({ eq: eqMock2 });
      // Submissions for user 1, lecture 11
      const eqMock3 = jest.fn().mockReturnThis();
      const eqMock4 = jest.fn().mockResolvedValue({
        data: [],
        error: null,
      });
      mockFrom.mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        eq: eqMock3,
      });
      eqMock3.mockReturnValueOnce({ eq: eqMock4 });
      // Submissions for user 2, lecture 10
      const eqMock5 = jest.fn().mockReturnThis();
      const eqMock6 = jest.fn().mockResolvedValue({
        data: [{ is_submit: false }],
        error: null,
      });
      mockFrom.mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        eq: eqMock5,
      });
      eqMock5.mockReturnValueOnce({ eq: eqMock6 });
      // Submissions for user 2, lecture 11
      const eqMock7 = jest.fn().mockReturnThis();
      const eqMock8 = jest.fn().mockResolvedValue({
        data: [],
        error: null,
      });
      mockFrom.mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        eq: eqMock7,
      });
      eqMock7.mockReturnValueOnce({ eq: eqMock8 });

      const result = await getStudentSubmissions(1);
      expect(result).toEqual([
        {
          userId: 1,
          userName: "A",
          userEmail: "a",
          submissions: [
            {
              lectureId: 100,
              isSubmitted: true,
              assignments: [{ url: "url1", comment: "c1" }],
            },
            {
              lectureId: 101,
              isSubmitted: false,
              assignments: undefined,
            },
          ],
        },
        {
          userId: 2,
          userName: "B",
          userEmail: "b",
          submissions: [
            {
              lectureId: 100,
              isSubmitted: false,
              assignments: undefined,
            },
            {
              lectureId: 101,
              isSubmitted: false,
              assignments: undefined,
            },
          ],
        },
      ]);
    });

    it("should return [] on error", async () => {
      mockFrom.mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({ data: [], error: null }),
      });
      const result = await getStudentSubmissions(1);
      expect(result).toEqual([]);
    });
  });
});
