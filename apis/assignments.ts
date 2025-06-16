import { supabase } from "./supabase";
import { ChallengeLecture } from "@/types/lecture";
import { handleError } from "@/utils/errorHandler";
import { uploadFileToStorage } from "@/utils/files";
import { checkIsTodayLecture } from "@/utils/date/serverTime";

export async function getAssignment(lectureId: number) {
  try {
    const { data: assignment, error } = await supabase
      .from("Assignments")
      .select("*")
      .eq("lecture_id", lectureId)
      .order("created_at", { ascending: true });

    if (error) throw error;

    // console.log("과제 정보:", assignment);

    return assignment || [];
  } catch (error) {
    handleError(error, "과제 데이터 조회 중 오류가 발생했습니다.");
  }
}

// 서버시간 더하기 9시간해서 비교하기
export async function createSubmission({
  link,
  text,
  challengeLectureId,
  userId,
  imageFile,
}: {
  link: string;
  text: string;
  challengeLectureId: number;
  userId: number;
  imageFile?: File;
}) {
  try {
    // 마감 기한 체크 로직
    const { data: lectureInfo, error: lectureError } = await supabase
      .from("ChallengeLectures")
      .select("due_at")
      .eq("id", challengeLectureId)
      .single();

    if (lectureError) throw lectureError;
    if (!lectureInfo) throw new Error("강의 정보를 찾을 수 없습니다.");

    const isTodayLecture = await checkIsTodayLecture(lectureInfo.due_at);

    if (isTodayLecture) {
      handleError(
        new Error("과제 제출 마감 기한이 지났습니다."),
        "과제 제출 마감 기한이 지났습니다.",
      );
    }

    let imageUrl = null;
    if (imageFile) {
      try {
        imageUrl = await uploadFileToStorage(imageFile, "assignment-images");
      } catch (uploadError) {
        handleError(
          uploadError,
          `이미지 업로드 중 오류가 발생했습니다: ${uploadError.message}`,
        );
      }
    }

    // 새로운 제출 생성
    const { data, error } = await supabase
      .from("Submissions")
      .insert([
        {
          user_id: userId,
          submitted_at: new Date().toISOString(),
          is_submit: true,
          assignment_url: link,
          assignment_comment: text,
          challenge_lecture_id: challengeLectureId,
          image_url: imageUrl,
        },
      ])
      .select();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("과제 제출 실패:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "과제 제출 중 오류가 발생했습니다.",
    );
  }
}

export async function updateSubmission({
  submissionId,
  link,
  text,
  imageFile,
}: {
  submissionId: number;
  link: string;
  text: string;
  imageFile?: File;
}) {
  try {
    // 제출 정보 조회하여 challenge_lecture_id와 기존 이미지 URL 가져오기
    const { data: submission, error: submissionError } = await supabase
      .from("Submissions")
      .select("challenge_lecture_id, image_url")
      .eq("id", submissionId)
      .single();

    if (submissionError) throw submissionError;
    if (!submission) throw new Error("제출 정보를 찾을 수 없습니다.");

    // 마감 기한 체크 로직
    const { data: lectureInfo, error: lectureError } = await supabase
      .from("ChallengeLectures")
      .select("due_at")
      .eq("id", submission.challenge_lecture_id)
      .single();

    if (lectureError) throw lectureError;
    if (!lectureInfo) throw new Error("강의 정보를 찾을 수 없습니다.");

    const { data: serverTime, error: timeError } =
      await supabase.rpc("get_server_time");

    if (timeError) throw timeError;

    // 서버 시간을 Date 객체로 변환하고 9시간 추가
    const currentServerTime = new Date(
      new Date(serverTime).getTime() + 9 * 60 * 60 * 1000,
    );
    const deadline = new Date(lectureInfo.due_at);

    if (currentServerTime > deadline) {
      throw new Error("과제 제출 마감 기한이 지났습니다.");
    }

    let imageUrl = submission.image_url;

    // 이미지 파일이 없는 경우 (이미지 제거)
    if (!imageFile) {
      // 기존 이미지가 있다면 삭제
      if (submission.image_url) {
        try {
          const oldImagePath = submission.image_url.split("/").pop();
          if (oldImagePath) {
            await supabase.storage
              .from("assignment-images")
              .remove([oldImagePath]);
          }
        } catch (deleteError) {
          console.error("기존 이미지 삭제 실패:", deleteError);
        }
      }
      imageUrl = null;
    }
    // 새로운 이미지 파일이 있는 경우에만 처리
    else if (imageFile) {
      // 기존 이미지가 있다면 삭제
      if (submission.image_url) {
        try {
          const oldImagePath = submission.image_url.split("/").pop();
          if (oldImagePath) {
            await supabase.storage
              .from("assignment-images")
              .remove([oldImagePath]);
          }
        } catch (deleteError) {
          console.error("기존 이미지 삭제 실패:", deleteError);
        }
      }

      // 새로운 이미지 업로드
      try {
        imageUrl = await uploadFileToStorage(imageFile, "assignment-images");
      } catch (uploadError) {
        handleError(
          uploadError,
          `이미지 업로드 중 오류가 발생했습니다: ${uploadError.message}`,
        );
      }
    }

    const { data, error } = await supabase
      .from("Submissions")
      .update({
        submitted_at: currentServerTime.toISOString(),
        is_submit: true,
        assignment_url: link,
        assignment_comment: text,
        image_url: imageUrl,
      })
      .eq("id", submissionId)
      .select();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("과제 수정 실패:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "과제 수정 중 오류가 발생했습니다.",
    );
  }
}

// 챌린지 별 각 강의 과제 통계를 계산하는 함수
export async function getAssignmentStats(challengeId: number) {
  try {
    // 1. ChallengeLectures 테이블에서 challenge_id로 데이터 조회
    const { data: challengeLectures, error: challengeError } = (await supabase
      .from("ChallengeLectures")
      .select(
        `
        id,
        lecture_id,
        Lectures!inner (
          id,
          name
        )
      `,
      )
      .eq("challenge_id", challengeId)
      .order("sequence", { ascending: true })) as {
      data: ChallengeLecture[] | null;
      error: any;
    };

    if (challengeError) throw challengeError;

    // 2. 챌린지의 전체 참여자 수 조회
    const { data: challengeUsers, error: usersError } = await supabase
      .from("ChallengeUsers")
      .select("user_id")
      .eq("challenge_id", challengeId);

    if (usersError) throw usersError;
    const totalParticipants = challengeUsers.length;

    // 3. 각 강의별 제출 현황과 과제 정보 조회
    const submissionRates = (
      await Promise.all(
        (challengeLectures || []).map(async (lecture) => {
          // 과제 정보 조회
          const { data: assignment, error: assignmentError } = await supabase
            .from("Assignments")
            .select("title")
            .eq("lecture_id", lecture.lecture_id)
            .maybeSingle();

          if (assignmentError) throw assignmentError;

          // 과제가 없는 경우 null 반환
          if (!assignment) return null;

          // 제출 현황 조회
          const { data: submissions, error: submissionError } = await supabase
            .from("Submissions")
            .select("user_id")
            .eq("challenge_lecture_id", lecture.id);

          if (submissionError) throw submissionError;

          const submittedCount = submissions.length;
          const submissionRate =
            totalParticipants > 0
              ? Math.round((submittedCount / totalParticipants) * 100)
              : 0;

          return {
            lectureId: lecture.lecture_id,
            lectureName: lecture.Lectures.name,
            totalParticipants,
            submittedCount,
            submissionRate,
            assignmentTitle: assignment.title,
          };
        }),
      )
    ).filter((item): item is NonNullable<typeof item> => item !== null);

    return submissionRates;
  } catch (error) {
    console.error("과제 제출률 계산 실패:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "과제 제출률 계산 중 오류가 발생했습니다.",
    );
  }
}

export async function getUserSubmission({
  userId,
  challengeLectureId,
}: {
  userId: number;
  challengeLectureId: number;
}) {
  try {
    const { data: submission, error } = await supabase
      .from("Submissions")
      .select("*")
      .eq("user_id", userId)
      .eq("challenge_lecture_id", challengeLectureId)
      .maybeSingle();

    if (error) {
      // console.error("Supabase 조회 중 에러:", error);
      throw error;
    }

    // console.log("제출된 과제:", submission);

    return submission || null;
  } catch (error) {
    // console.error("제출된 과제 조회 실패:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "제출된 과제 조회 중 오류가 발생했습니다.",
    );
  }
}

export async function deleteSubmission(submissionId: number) {
  try {
    // 제출 정보 조회하여 이미지 URL 가져오기
    const { data: submission, error: submissionError } = await supabase
      .from("Submissions")
      .select("image_url")
      .eq("id", submissionId)
      .single();

    if (submissionError) throw submissionError;
    if (!submission) throw new Error("제출 정보를 찾을 수 없습니다.");

    // 이미지가 있다면 스토리지에서 삭제
    if (submission.image_url) {
      try {
        const imagePath = submission.image_url.split("/").pop();
        if (imagePath) {
          await supabase.storage.from("assignment-images").remove([imagePath]);
        }
      } catch (deleteError) {
        console.error("이미지 삭제 실패:", deleteError);
      }
    }

    // 제출 정보 삭제
    const { error } = await supabase
      .from("Submissions")
      .delete()
      .eq("id", submissionId);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error("과제 삭제 실패:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "과제 삭제 중 오류가 발생했습니다.",
    );
  }
}
