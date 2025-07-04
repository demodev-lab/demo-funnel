import { supabase } from "./supabase";
import { User, UserWithChallenges, StudentSubmission } from "@/types/user";
import { handleError } from "@/utils/errorHandler";

export async function getUsers() {
  try {
    const { data, error } = await supabase
      .from("Users")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) throw error;
    return data;
  } catch (error) {
    handleError(error, "사용자 데이터 패칭 실패");
    return [];
  }
}

export async function createUser(data: Omit<UserWithChallenges, "id">) {
  try {
    const { challenges, ...userData } = data;

    // 이메일 중복 체크와 함께 기존 챌린지 목록도 함께 조회
    const { data: existingUser, error: checkError } = await supabase
      .from("Users")
      .select(
        `
        id,
        ChallengeUsers (
          challenge_id
        )
      `,
      )
      .eq("email", userData.email)
      .single();

    if (checkError && checkError.code !== "PGRST116") {
      handleError(checkError, "이메일 중복 체크 실패");
    }

    let userId: number;

    if (existingUser) {
      // 기존 사용자가 있는 경우
      userId = existingUser.id;

      // 기존 챌린지 ID 목록
      const existingChallengeIds = existingUser.ChallengeUsers.map(
        (cu: { challenge_id: number }) => cu.challenge_id,
      );

      // 추가하려는 챌린지 중 이미 등록된 챌린지가 있는지 확인
      const duplicatedChallenges = challenges?.filter((challengeId) =>
        existingChallengeIds.includes(challengeId),
      );

      if (duplicatedChallenges && duplicatedChallenges.length > 0) {
        throw new Error("이미 등록된 챌린지가 있습니다.");
      }

      // 새로운 챌린지만 필터링
      const newChallenges = challenges?.filter(
        (challengeId) => !existingChallengeIds.includes(challengeId),
      );

      if (newChallenges && newChallenges.length > 0) {
        const challengeUsers = newChallenges.map((challengeId: number) => ({
          user_id: userId,
          challenge_id: challengeId,
          enrolled_at: new Date().toISOString(),
        }));

        const { error: challengeError } = await supabase
          .from("ChallengeUsers")
          .insert(challengeUsers);

        if (challengeError) throw challengeError;
      }
    } else {
      // 새로운 사용자인 경우
      const { data: newUser, error: userError } = await supabase
        .from("Users")
        .insert(userData)
        .select()
        .single();

      if (userError) throw userError;
      userId = newUser.id;

      if (challenges && Array.isArray(challenges)) {
        const challengeUsers = challenges.map((challengeId: number) => ({
          user_id: userId,
          challenge_id: challengeId,
          enrolled_at: new Date().toISOString(),
        }));

        const { error: challengeError } = await supabase
          .from("ChallengeUsers")
          .insert(challengeUsers);

        if (challengeError) throw challengeError;
      }
    }

    return;
  } catch (error) {
    handleError(error, "사용자 데이터 패칭 실패");
  }
}

export async function updateUser(data: { id: number; [key: string]: any }) {
  try {
    if (!data.id) {
      throw new Error("사용자 ID가 필요합니다.");
    }

    const { challenges, ...userData } = data;

    const { data: existingUser, error: checkError } = await supabase
      .from("Users")
      .select("*")
      .eq("id", data.id)
      .single();

    if (checkError) throw checkError;
    if (!existingUser) {
      throw new Error(`ID가 ${data.id}인 사용자를 찾을 수 없습니다.`);
    }

    const { data: updatedUser, error: updateError } = await supabase
      .from("Users")
      .update(userData)
      .eq("id", data.id)
      .select()
      .single();

    if (updateError) throw updateError;

    if (challenges && Array.isArray(challenges)) {
      const { error: deleteError } = await supabase
        .from("ChallengeUsers")
        .delete()
        .eq("user_id", data.id);

      if (deleteError) throw deleteError;

      const challengeUsers = challenges.map((challengeId: number) => ({
        user_id: data.id,
        challenge_id: challengeId,
        enrolled_at: new Date().toISOString(),
      }));

      const { error: insertError } = await supabase
        .from("ChallengeUsers")
        .insert(challengeUsers);

      if (insertError) throw insertError;
    }

    return updatedUser;
  } catch (error) {
    handleError(error, "사용자 업데이트 실패");
    throw error;
  }
}

export async function deleteUser(userId: number) {
  try {
    const { data: existingUser, error: checkError } = await supabase
      .from("Users")
      .select("*")
      .eq("id", userId)
      .single();

    if (checkError) throw checkError;
    if (!existingUser) {
      throw new Error(`ID가 ${userId}인 사용자를 찾을 수 없습니다.`);
    }

    const { error: challengeDeleteError } = await supabase
      .from("ChallengeUsers")
      .delete()
      .eq("user_id", userId);

    if (challengeDeleteError) throw challengeDeleteError;

    const { error: userDeleteError } = await supabase
      .from("Users")
      .delete()
      .eq("id", userId);

    if (userDeleteError) throw userDeleteError;

    return { success: true };
  } catch (error) {
    handleError(error, "사용자 삭제 실패");
    throw error;
  }
}

interface ChallengeUserResponse {
  user_id: number;
  Users: {
    id: number;
    name: string;
    email: string;
    phone: string;
  };
}

export async function getChallengeUsers(
  challengeId: number,
  page: number = 0,
  pageSize: number = 10,
  sortBy: string = "name",
  sortOrder?: "asc" | "desc",
): Promise<{ data: User[]; total: number }> {
  try {
    if (!challengeId) {
      return { data: [], total: 0 };
    }

    // 전체 수강생 수 조회
    const { count: totalUsers, error: countError } = await supabase
      .from("ChallengeUsers")
      .select("*", { count: "exact", head: true })
      .eq("challenge_id", challengeId);

    if (countError) throw countError;

    const start = page * pageSize;
    const end = start + pageSize - 1;

    // 기본 쿼리 생성
    let query = supabase
      .from("ChallengeUsers")
      .select(
        `
        user_id,
        Users!inner (
          id,
          name,
          email,
          phone,
          created_at
        )
      `,
      )
      .eq("challenge_id", challengeId)
      .range(start, end);

    // 정렬 옵션 적용
    if (sortOrder && sortBy === "name") {
      query = query.order("Users(name)", { ascending: sortOrder === "asc" });
    } else {
      // 기본적으로 created_at 오름차순 정렬
      query = query.order("Users(created_at)", { ascending: true });
    }

    // 쿼리 실행
    const { data, error } = await query;

    if (error) throw error;

    const typedData = data as unknown as ChallengeUserResponse[];

    return {
      data: typedData.map((item) => ({
        id: item.Users.id,
        name: item.Users.name,
        email: item.Users.email,
        phone: item.Users.phone,
      })),
      total: totalUsers || 0,
    };
  } catch (error) {
    handleError(error, "수강생 목록 조회 실패");
    return { data: [], total: 0 };
  }
}

export async function getStudentSubmissions(
  challengeId: number,
  page: number = 0,
  pageSize: number = 10,
  completedOnly: boolean = false,
): Promise<{ data: StudentSubmission[]; total: number }> {
  try {
    // 1. ChallengeLectures 조회하여 해당 챌린지의 강의 목록 가져오기
    const { data: challengeLectures, error: challengeLecturesError } =
      await supabase
        .from("ChallengeLectures")
        .select("id, lecture_id, due_at, sequence")
        .eq("challenge_id", challengeId)
        .order("sequence", { ascending: true });

    if (challengeLecturesError) throw challengeLecturesError;

    if (!challengeLectures || challengeLectures.length === 0) {
      return { data: [], total: 0 };
    }

    // 2. 과제가 있는 강의만 필터링
    const { data: assignments, error: assignmentsError } = await supabase
      .from("Assignments")
      .select("lecture_id")
      .in(
        "lecture_id",
        challengeLectures.map((cl) => cl.lecture_id),
      );

    if (assignmentsError) throw assignmentsError;

    // 과제가 있는 강의 ID 목록
    const lectureIdsWithAssignments = new Set(
      assignments?.map((a) => a.lecture_id) || [],
    );

    // 과제가 있는 강의만 필터링
    const filteredChallengeLectures = challengeLectures.filter((cl) =>
      lectureIdsWithAssignments.has(cl.lecture_id),
    );

    if (filteredChallengeLectures.length === 0) {
      return { data: [], total: 0 };
    }

    // 3. 완주자만 보기가 활성화된 경우, 모든 과제를 제출한 사용자 ID 목록 가져오기
    let userIds: number[] = [];
    if (completedOnly) {
      // 모든 강의에 대해 제출 여부 확인
      const submissionPromises = filteredChallengeLectures.map((lecture) =>
        supabase
          .from("Submissions")
          .select("user_id")
          .eq("challenge_lecture_id", lecture.id)
          .eq("is_submit", true),
      );

      const submissionResults = await Promise.all(submissionPromises);
      const submittedUserIds = submissionResults
        // .slice(1) // 강의1 제출자 제외(첫번째 챌린지만. 추후 꼭 삭제할 것.)
        .map((result) => result.data?.map((sub) => sub.user_id) || []);

      // 모든 강의에 대해 과제를 제출한 사용자 ID만 필터링
      let [first, ...rest] = submittedUserIds;
      let acc = first; // (빈 배열조차 손실없이)
      for (let curr of rest) {
        acc = acc.filter((id) => curr.includes(id));
      }
      userIds = acc;

      if (userIds.length === 0) {
        return { data: [], total: 0 };
      }
    }

    // 4. 전체 수강생 수 조회
    const countQuery = supabase
      .from("ChallengeUsers")
      .select("*", { count: "exact", head: true })
      .eq("challenge_id", challengeId);

    if (completedOnly && userIds.length > 0) {
      countQuery.in("user_id", userIds);
    }

    const { count } = await countQuery;

    // 5. 페이지네이션된 수강생 목록 조회
    const userQuery = supabase
      .from("ChallengeUsers")
      .select(
        `
        user_id,
        Users (
          id,
          name,
          email
        )
      `,
      )
      .eq("challenge_id", challengeId);

    if (completedOnly && userIds.length > 0) {
      userQuery.in("user_id", userIds);
    }

    const { data: challengeUsers, error: challengeUsersError } = await userQuery
      .range(page * pageSize, (page + 1) * pageSize - 1)
      .order("user_id", { ascending: true });

    if (challengeUsersError) throw challengeUsersError;

    // 6. 각 수강생별로 제출 여부 확인
    const studentSubmissions = await Promise.all(
      (challengeUsers || []).map(async (user: any) => {
        // 각 강의별 제출 여부 조회
        const submissions = await Promise.all(
          filteredChallengeLectures.map(async (lecture) => {
            const { data: submissions, error: submissionError } = await supabase
              .from("Submissions")
              .select(
                "id, is_submit, assignment_url, assignment_comment, image_url, submitted_at",
              )
              .eq("user_id", user.user_id)
              .eq("challenge_lecture_id", lecture.id);

            if (submissionError) throw submissionError;

            const isSubmitted =
              submissions?.some((sub) => sub.is_submit) ?? false;
            const assignments =
              submissions
                ?.filter((sub) => sub.is_submit)
                .map((submission) => ({
                  url: submission.assignment_url,
                  comment: submission.assignment_comment,
                  imageUrl: submission.image_url,
                })) ?? [];

            return {
              lectureId: lecture.lecture_id,
              challengeLectureId: lecture.id,
              dueDate: lecture.due_at,
              isSubmitted,
              submissionId: submissions?.[0]?.id,
              submittedAt: submissions?.[0]?.submitted_at
                ? new Date(submissions[0].submitted_at)
                    .toLocaleString("ko-KR", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })
                    .replace(/\. /g, "-")
                    .replace(/\./g, "")
                    .replace(",", "")
                    .replace(/(\d{4}-\d{2}-\d{2})-/, "$1 ")
                : undefined,
              sequence: lecture.sequence,
              assignments: assignments.length > 0 ? assignments : undefined,
            };
          }),
        );

        return {
          userId: user.user_id,
          userName: user.Users.name,
          userEmail: user.Users.email,
          submissions,
        };
      }),
    );

    return {
      data: studentSubmissions,
      total: count || 0,
    };
  } catch (error) {
    handleError(error, "수강생 제출 현황 조회 실패");
    throw error;
  }
}

export async function getUserAllAssignmentStatus(
  userId: number,
  challengeId: number,
  challengeLectures?: { id: number; lecture_id: number }[],
): Promise<{
  isAllSubmitted: boolean;
  isRefundRequested: boolean;
}> {
  try {
    // 1. 강의 목록이 전달되지 않은 경우에만 조회
    // (이미 사용자 페이지에서 챌린지의 강의 목록을 가져오고 있어 API 중복 호출 방지를 위함)
    let lectures = challengeLectures;
    if (!lectures) {
      const { data: fetchedLectures, error: challengeLecturesError } =
        await supabase
          .from("ChallengeLectures")
          .select("id, lecture_id")
          .eq("challenge_id", challengeId)
          .order("sequence", { ascending: true });

      if (challengeLecturesError) throw challengeLecturesError;
      if (!fetchedLectures || fetchedLectures.length === 0) {
        return {
          isAllSubmitted: false,
          isRefundRequested: false,
        };
      }
      lectures = fetchedLectures;
    }

    // 2. 과제가 있는 강의만 필터링
    const { data: assignments, error: assignmentsError } = await supabase
      .from("Assignments")
      .select("lecture_id")
      .in(
        "lecture_id",
        lectures.map((cl) => cl.lecture_id),
      );

    if (assignmentsError) throw assignmentsError;

    const lectureIdsWithAssignments = new Set(
      assignments?.map((a) => a.lecture_id) || [],
    );

    const filteredChallengeLectures = lectures.filter((cl) =>
      lectureIdsWithAssignments.has(cl.lecture_id),
    );

    if (filteredChallengeLectures.length === 0) {
      return {
        isAllSubmitted: false,
        isRefundRequested: false,
      };
    }

    // 3. 각 강의별 제출 여부 확인
    const submissions = await Promise.all(
      filteredChallengeLectures.map(async (lecture) => {
        const { data: submissions, error: submissionError } = await supabase
          .from("Submissions")
          .select("is_submit")
          .eq("user_id", userId)
          .eq("challenge_lecture_id", lecture.id);

        if (submissionError) throw submissionError;

        return submissions?.some((sub) => sub.is_submit) ?? false;
      }),
    );

    // 4. 모든 과제 제출 여부 확인
    const isAllSubmitted = submissions.every((isSubmitted) => isSubmitted);

    // ChallengeUsers 테이블에서 refund_requested 상태 확인
    const { data: challengeUser, error: challengeUserError } = await supabase
      .from("ChallengeUsers")
      .select("refund_requested")
      .eq("user_id", userId)
      .eq("challenge_id", challengeId)
      .single();

    if (challengeUserError) throw challengeUserError;

    return {
      isAllSubmitted,
      isRefundRequested: challengeUser?.refund_requested ?? false,
    };
  } catch (error) {
    handleError(error, "수강생 과제 제출 현황 조회 실패");
    throw error;
  }
}

export async function updateRefundRequestStatus(
  userId: number,
  challengeId: number,
) {
  try {
    const { error } = await supabase
      .from("ChallengeUsers")
      .update({ refund_requested: true })
      .eq("user_id", userId)
      .eq("challenge_id", challengeId);

    if (error) {
      throw error;
    }
  } catch (error) {
    handleError(error, "환급 신청 상태 업데이트 실패");
    throw error;
  }
}
