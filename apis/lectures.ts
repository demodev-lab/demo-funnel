import { supabase } from "./supabase";
import {
  ChallengeLectures,
  LectureData,
  LectureDetail,
  LectureWithSequence,
} from "@/types/lecture";
import { ChallengeUser } from "@/types/challenge";
import { UPLOAD_TYPE } from "@/constants/uploadTypes";
import { uploadFileToStorage, deleteStorageFile } from "@/utils/files";
import { validateAuth } from "@/utils/auth";
import { handleError } from "@/utils/errorHandler";

const createLectureRecord = async (data: LectureData, videoUrl: string) => {
  const { data: lecture, error: lectureError } = await supabase
    .from("Lectures")
    .insert([
      {
        name: data.name,
        description: data.description,
        url: videoUrl,
        upload_type: data.upload_type,
      },
    ])
    .select()
    .single();

  if (lectureError) {
    handleError(lectureError, "강의 생성에 실패했습니다.");
  }

  return lecture;
};

const createChallengeLectures = async (
  lectureId: number,
  challenges: number[],
  challengeOrders?: { challengeId: number; order: number }[],
) => {
  const { data: challengesData, error: challengesError } = await supabase
    .from("Challenges")
    .select("id, open_date")
    .in("id", challenges);

  if (challengesError) {
    handleError(challengesError, "챌린지 정보 조회에 실패했습니다.");
  }

  const challengeLectures = challenges.map((challengeId) => {
    const challenge = challengesData.find(
      (c) => c.id.toString() === challengeId.toString(),
    );
    const openDate = new Date(challenge?.open_date || "");
    const sequence =
      challengeOrders?.find((co) => co.challengeId === challengeId)?.order || 1;

    const openAt = new Date(openDate);
    openAt.setDate(openAt.getDate() + (sequence - 1));

    const dueAt = new Date(openAt);
    dueAt.setDate(dueAt.getDate() + 1);

    return {
      lecture_id: lectureId,
      challenge_id: challengeId,
      sequence: sequence,
      open_at: openAt.toISOString(),
      due_at: dueAt.toISOString(),
    };
  });

  const { error: challengeError } = await supabase
    .from("ChallengeLectures")
    .insert(challengeLectures);

  if (challengeError) {
    handleError(challengeError, "챌린지 연결에 실패했습니다.");
  }
};

const createAssignment = async (
  lectureId: number,
  title: string,
  contents: string,
) => {
  const { error: assignmentError } = await supabase.from("Assignments").insert([
    {
      lecture_id: lectureId,
      title,
      contents,
    },
  ]);

  if (assignmentError) {
    handleError(assignmentError, "과제 추가에 실패했습니다.");
  }
};

export async function createLecture(data: LectureData) {
  await validateAuth();

  try {
    let videoUrl = data.url;

    if (data.file && data.upload_type === UPLOAD_TYPE.VIDEO) {
      videoUrl = await uploadFileToStorage(data.file, "videos");
    }

    const lecture = await createLectureRecord(data, videoUrl);

    if (data.challenges && data.challenges.length > 0) {
      await createChallengeLectures(
        lecture.id,
        data.challenges,
        data.challengeOrders,
      );
    }

    if (data.assignmentTitle && data.assignment) {
      await createAssignment(lecture.id, data.assignmentTitle, data.assignment);
    }

    return lecture;
  } catch (error) {
    throw error;
  }
}

const updateLectureRecord = async (
  lectureId: number,
  data: LectureData,
  videoUrl: string,
) => {
  const { data: updatedLecture, error: lectureError } = await supabase
    .from("Lectures")
    .update({
      name: data.name,
      description: data.description,
      url: videoUrl,
      upload_type: data.upload_type,
      updated_at: new Date().toISOString(),
    })
    .eq("id", lectureId)
    .select()
    .single();

  if (lectureError) {
    handleError(lectureError, "강의 수정에 실패했습니다.");
  }

  return updatedLecture;
};

const updateChallengeLectures = async (
  lectureId: number,
  challenges: number[],
  challengeOrders?: { challengeId: number; order: number }[],
) => {
  const { data: challengesData, error: challengesError } = await supabase
    .from("Challenges")
    .select("id, open_date")
    .in("id", challenges);

  if (challengesError) {
    handleError(challengesError, "챌린지 정보 조회에 실패했습니다.");
  }

  for (const challengeId of challenges) {
    const challenge = challengesData.find(
      (c) => c.id.toString() === challengeId.toString(),
    );
    const openDate = new Date(challenge?.open_date || "");
    const sequence =
      challengeOrders?.find((co) => co.challengeId === challengeId)?.order || 1;

    const openAt = new Date(openDate);
    openAt.setDate(openAt.getDate() + (sequence - 1));

    const dueAt = new Date(openAt);
    dueAt.setDate(dueAt.getDate() + 1);

    const { data: existingLink, error: checkError } = await supabase
      .from("ChallengeLectures")
      .select("id")
      .eq("lecture_id", lectureId)
      .eq("challenge_id", challengeId)
      .single();

    if (checkError && checkError.code !== "PGRST116") {
      handleError(checkError, "챌린지 연결 확인에 실패했습니다.");
    }

    if (existingLink) {
      const { error: updateError } = await supabase
        .from("ChallengeLectures")
        .update({
          sequence: sequence,
          open_at: openAt.toISOString(),
          due_at: dueAt.toISOString(),
        })
        .eq("lecture_id", lectureId)
        .eq("challenge_id", challengeId);

      if (updateError) {
        handleError(updateError, "챌린지 연결 업데이트에 실패했습니다.");
      }
    } else {
      const { error: insertError } = await supabase
        .from("ChallengeLectures")
        .insert({
          lecture_id: lectureId,
          challenge_id: challengeId,
          sequence: sequence,
          open_at: openAt.toISOString(),
          due_at: dueAt.toISOString(),
        });

      if (insertError) {
        handleError(insertError, "챌린지 연결 추가에 실패했습니다.");
      }
    }
  }
};

const updateAssignment = async (
  lectureId: number,
  title: string,
  contents: string,
) => {
  const { error: assignmentError } = await supabase
    .from("Assignments")
    .update({
      title,
      contents,
    })
    .eq("lecture_id", lectureId);

  if (assignmentError) {
    handleError(assignmentError, "과제 업데이트에 실패했습니다.");
  }
};

export async function updateLecture(lectureId: number, data: LectureData) {
  await validateAuth();

  try {
    let videoUrl = data.url;

    if (data.file && data.upload_type === UPLOAD_TYPE.VIDEO) {
      const { data: existingLecture, error: fetchError } = await supabase
        .from("Lectures")
        .select("url, upload_type")
        .eq("id", lectureId)
        .single();

      if (fetchError) {
        handleError(fetchError, "기존 강의 정보 조회에 실패했습니다.");
      }

      if (
        existingLecture?.upload_type === UPLOAD_TYPE.VIDEO &&
        existingLecture?.url
      ) {
        await deleteStorageFile(existingLecture.url, "videos");
      }

      videoUrl = await uploadFileToStorage(data.file, "videos");
    }

    const updatedLecture = await updateLectureRecord(lectureId, data, videoUrl);

    if (data.challenges && data.challenges.length > 0) {
      await updateChallengeLectures(
        lectureId,
        data.challenges,
        data.challengeOrders,
      );
    }

    if (data.assignmentTitle && data.assignment) {
      // 기존 과제가 있는지 확인
      const { data: existingAssignment, error: checkError } = await supabase
        .from("Assignments")
        .select("id")
        .eq("lecture_id", lectureId)
        .single();

      if (checkError && checkError.code !== "PGRST116") {
        handleError(checkError, "과제 정보 조회에 실패했습니다.");
      }

      if (existingAssignment) {
        // 기존 과제가 있으면 업데이트
        await updateAssignment(
          lectureId,
          data.assignmentTitle,
          data.assignment,
        );
      } else {
        // 기존 과제가 없으면 새로 생성
        await createAssignment(
          lectureId,
          data.assignmentTitle,
          data.assignment,
        );
      }
    } else {
      // 입력된 과제 데이터가 없는 경우 기존 과제 삭제
      const { error: deleteError } = await supabase
        .from("Assignments")
        .delete()
        .eq("lecture_id", lectureId);

      if (deleteError) {
        handleError(deleteError, "기존 과제 삭제에 실패했습니다.");
      }
    }

    return updatedLecture;
  } catch (error) {
    throw error;
  }
}

export async function deleteLecture(lectureId: number) {
  await validateAuth();

  try {
    // 먼저 강의 정보를 조회
    const { data: lecture, error: fetchError } = await supabase
      .from("Lectures")
      .select("url, upload_type")
      .eq("id", lectureId)
      .single();

    if (fetchError) {
      if (fetchError.code === "PGRST116") {
        handleError(fetchError, `ID가 ${lectureId}인 강의를 찾을 수 없습니다.`);
      }
      throw fetchError;
    }

    // 1. ChallengeLectures 삭제
    const { error: challengeDeleteError } = await supabase
      .from("ChallengeLectures")
      .delete()
      .eq("lecture_id", lectureId);

    if (challengeDeleteError) {
      handleError(challengeDeleteError, "챌린지 삭제에 실패했습니다.");
    }

    // 2. Assignments 삭제
    const { error: assignmentDeleteError } = await supabase
      .from("Assignments")
      .delete()
      .eq("lecture_id", lectureId);

    if (assignmentDeleteError) {
      handleError(assignmentDeleteError, "과제 삭제에 실패했습니다.");
    }

    // 3. Lectures 삭제
    const { error: deleteError } = await supabase
      .from("Lectures")
      .delete()
      .eq("id", lectureId);

    if (deleteError) {
      handleError(deleteError, "강의 삭제에 실패했습니다.");
    }

    // 4. 스토리지 파일 삭제
    if (lecture?.upload_type === UPLOAD_TYPE.VIDEO && lecture?.url) {
      await deleteStorageFile(lecture.url, "videos");
    }

    return { success: true };
  } catch (error) {
    throw error;
  }
}

export async function getLectureDetail(
  lectureId: number,
): Promise<LectureDetail | null> {
  try {
    const { data, error } = await supabase
      .from("Lectures")
      .select(
        `
        *,
        Assignments (
          id,
          title,
          contents
        ),
        ChallengeLectures (
          id,
          sequence,
          Challenges (
            id,
            name
          )
        )
      `,
      )
      .eq("id", lectureId)
      .maybeSingle();

    if (error) {
      if (error.code === "PGRST116") {
        return null;
      }
      throw error;
    }

    return data;
  } catch (error) {
    return null;
  }
}

export async function getUserLectures(userId: number) {
  try {
    const { data: challengeData, error: challengeError } = await supabase
      .from("ChallengeUsers")
      .select(
        `
        challenge_id,
        Challenges!inner (
          id,
          close_date,
          open_date
        )
      `,
      )
      .eq("user_id", userId);

    if (challengeError)
      handleError(challengeError, "챌린지 사용자 조회에 실패했습니다.");
    if (!challengeData || challengeData.length === 0) {
      handleError(challengeError, "사용자가 속한 챌린지를 찾을 수 없습니다.");
    }

    const { data: serverTime, error: timeError } = await supabase.rpc(
      "get_server_time",
    );
    if (timeError) handleError(timeError, "서버 시간 조회에 실패했습니다.");

    const currentDate = serverTime.split("T")[0];

    const activeChallengeIds = (challengeData as unknown as ChallengeUser[])
      .filter((challenge) => {
        if (!challenge.Challenges) {
          return false;
        }
        const openDate = challenge.Challenges.open_date;
        const closeDate = challenge.Challenges.close_date;
        return currentDate >= openDate && currentDate <= closeDate;
      })
      .map((challenge) => challenge.challenge_id);

    if (activeChallengeIds.length === 0) {
      return [];
    }

    const { data: lectureData, error: lectureError } = await supabase
      .from("ChallengeLectures")
      .select(
        `
        id,
        lecture_id,
        open_at,
        challenge_id,
        Lectures (
          id,
          name,
          description,
          url,
          created_at
        )
      `,
      )
      .in("challenge_id", activeChallengeIds)
      .order("open_at", { ascending: true });

    if (lectureError)
      handleError(lectureError, "강의 목록 조회에 실패했습니다.");

    const lectures =
      lectureData?.map((item) => ({
        ...item.Lectures,
        challenge_lecture_id: item.id,
        open_at: item.open_at,
        challenge_id: item.challenge_id,
      })) || [];

    return lectures;
  } catch (error) {
    handleError(
      error,
      "사용자의 챌린지 강의 목록 조회 중 오류가 발생했습니다.",
    );
  }
}

export async function getLecturesByChallenge(
  challengeId: number,
): Promise<LectureWithSequence[]> {
  try {
    const { data, error } = await supabase
      .from("ChallengeLectures")
      .select(
        `
        lecture_id,
        sequence,
        Lectures (
          id,
          name,
          description,
          url,
          upload_type,
          created_at,
          updated_at,
          Assignments (
            title,
            contents
          )
        )
      `,
      )
      .eq("challenge_id", challengeId)
      .order("sequence", { ascending: true })
      .returns<ChallengeLectures[]>();

    if (error) handleError(error, "강의 목록 조회에 실패했습니다.");

    const lectures =
      data?.map((item) => ({
        id: item.Lectures.id,
        name: item.Lectures.name,
        description: item.Lectures.description,
        url: item.Lectures.url,
        upload_type: item.Lectures.upload_type,
        created_at: item.Lectures.created_at,
        updated_at: item.Lectures.updated_at,
        sequence: item.sequence,
        assignment_title: item.Lectures.Assignments?.[0]?.title || "",
        assignment: item.Lectures.Assignments?.[0]?.contents || "",
      })) || [];

    return lectures;
  } catch (error) {
    handleError(error, "강의 목록 조회에 실패했습니다.");
    return [];
  }
}
