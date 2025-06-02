import { supabase } from "./supabase";

interface Challenge {
  id: number;
  name: string;
}

interface ChallengeLectureResponse {
  lecture_id: number;
  sequence: number;
  Lectures: {
    id: number;
    name: string;
    description: string;
    url: string;
    upload_type: number;
    created_at: string;
    updated_at: string;
    Assignments: Array<{
      title: string;
      contents: string;
    }>;
  };
}

interface LectureChallenge {
  Challenges: {
    id: number;
    name: string;
  };
}

interface ChallengeUser {
  challenge_id: number;
  Challenges: {
    id: number;
    open_date: string;
    close_date: string;
  };
}

export interface CreateLectureData {
  title: string;
  description: string;
  url: string;
  challenges: number[];
  assignmentTitle?: string;
  assignment?: string;
  challengeOrders?: { challengeId: number; order: number }[];
  file?: File;
  upload_type: number;
}

export interface UpdateLectureData {
  name: string;
  description: string;
  url: string;
  challenges: number[];
  assignmentTitle?: string;
  assignment?: string;
  challengeOrders?: { challengeId: number; order: number }[];
  file?: File;
  upload_type: number;
}

export interface LectureDetail {
  id: number;
  name: string;
  description: string;
  url: string;
  upload_type: number;
  created_at: string;
  updated_at: string;
  Assignments: {
    id: number;
    title: string;
    contents: string;
  }[];
  ChallengeLectures: {
    challenge_id: number;
    sequence: number;
    Challenges: {
      id: number;
      name: string;
    };
  }[];
}

export interface LectureWithSequence {
  id: number;
  name: string;
  description: string;
  url: string;
  upload_type: number;
  created_at: string;
  updated_at: string;
  sequence: number;
  assignment_title: string;
  assignment: string;
}

export async function getLectures() {
  try {
    const { data, error } = await supabase
      .from("Lectures")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) throw error;

    console.log("강의 목록: ", data);
    return data;
  } catch (error) {
    console.error("데이터 패칭 실패", error);
    return [];
  }
}

export async function createLecture(data: CreateLectureData) {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("사용자 인증이 필요합니다.");
  }

  try {
    console.log("강의 생성 시도:", data);

    let videoUrl = data.url;

    // 파일이 있는 경우 Supabase Storage에 업로드
    if (data.file && data.upload_type === 1) {
      // 파일 이름에서 확장자 추출
      const fileExtension = data.file.name.split(".").pop();
      // 안전한 파일 이름 생성 (timestamp + 랜덤 문자열)
      const timestamp = new Date().getTime();
      const randomString = Math.random().toString(36).substring(2, 15);
      const safeFileName = `${timestamp}-${randomString}.${fileExtension}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("videos")
        .upload(`/${safeFileName}`, data.file, {
          cacheControl: "3600",
          upsert: false,
          contentType: data.file.type,
        });

      if (uploadError) {
        console.error("파일 업로드 에러:", uploadError);
        throw uploadError;
      }

      // 업로드된 파일의 URL 가져오기
      const {
        data: { publicUrl },
      } = supabase.storage.from("videos").getPublicUrl(uploadData.path);

      videoUrl = publicUrl;
    }

    // Lectures 테이블에 강의 추가
    const { data: lecture, error: lectureError } = await supabase
      .from("Lectures")
      .insert([
        {
          name: data.title,
          description: data.description,
          url: videoUrl,
          upload_type: data.upload_type,
        },
      ])
      .select()
      .single();

    if (lectureError) {
      console.error("강의 추가 에러:", lectureError);
      throw lectureError;
    }

    console.log("생성된 강의:", lecture);

    // 선택된 챌린지들을 ChallengeLectures 테이블에 추가
    if (data.challenges && data.challenges.length > 0) {
      // 각 챌린지의 open_date 가져오기
      const { data: challengesData, error: challengesError } = await supabase
        .from("Challenges")
        .select("id, open_date")
        .in("id", data.challenges);

      if (challengesError) {
        console.error("챌린지 정보 조회 에러:", challengesError);
        throw challengesError;
      }

      // ChallengeLectures 테이블에 데이터 추가
      const challengeLectures = data.challenges.map((challengeId) => {
        const challenge = challengesData.find(
          (c) => c.id.toString() === challengeId.toString(),
        );
        const openDate = new Date(challenge?.open_date || "");
        const sequence =
          data.challengeOrders?.find((co) => co.challengeId === challengeId)
            ?.order || 1;

        // open_at 계산 (sequence에 따라 날짜 추가)
        const openAt = new Date(openDate);
        openAt.setDate(openAt.getDate() + (sequence - 1));

        // due_at 계산 (open_at에서 하루 더하기)
        const dueAt = new Date(openAt);
        dueAt.setDate(dueAt.getDate() + 1);

        return {
          lecture_id: lecture.id,
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
        console.error("챌린지 연결 에러:", challengeError);
        throw challengeError;
      }
    }

    // 과제가 있는 경우 Assignments 테이블에 추가
    if (data.assignmentTitle && data.assignment) {
      const { error: assignmentError } = await supabase
        .from("Assignments")
        .insert([
          {
            lecture_id: lecture.id,
            title: data.assignmentTitle,
            contents: data.assignment,
          },
        ]);

      if (assignmentError) {
        console.error("과제 추가 에러:", assignmentError);
        throw assignmentError;
      }
    }

    return lecture;
  } catch (error) {
    console.error("강의 추가 실패:", error);
    throw error;
  }
}

export async function updateLecture(
  lectureId: number,
  data: UpdateLectureData,
) {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("사용자 인증이 필요합니다.");
  }

  try {
    console.log("수정 요청 데이터:", data);

    let videoUrl = data.url;

    // 파일이 있는 경우 Supabase Storage에 업로드
    if (data.file && data.upload_type === 1) {
      // 기존 강의 정보 조회
      const { data: existingLecture, error: fetchError } = await supabase
        .from("Lectures")
        .select("url, upload_type")
        .eq("id", lectureId)
        .single();

      if (fetchError) {
        console.error("기존 강의 정보 조회 에러:", fetchError);
        throw fetchError;
      }

      // 기존 파일이 Supabase Storage에 있는 경우 삭제
      if (existingLecture?.upload_type === 1 && existingLecture?.url) {
        await deleteStorageFile(existingLecture.url);
      }

      // 새로운 파일 업로드
      const fileExtension = data.file.name.split(".").pop();
      const timestamp = new Date().getTime();
      const randomString = Math.random().toString(36).substring(2, 15);
      const safeFileName = `${timestamp}-${randomString}.${fileExtension}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("videos")
        .upload(`/${safeFileName}`, data.file, {
          cacheControl: "3600",
          upsert: false,
          contentType: data.file.type,
        });

      if (uploadError) {
        console.error("파일 업로드 에러:", uploadError);
        throw uploadError;
      }

      // 업로드된 파일의 URL 가져오기
      const {
        data: { publicUrl },
      } = supabase.storage.from("videos").getPublicUrl(uploadData.path);

      videoUrl = publicUrl;
    }

    // 강의 정보 업데이트
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
      console.error("강의 수정 에러:", lectureError);
      throw lectureError;
    }

    // 기존 챌린지 연결 정보 조회
    const { data: existingLinks, error: existingError } = await supabase
      .from("ChallengeLectures")
      .select("challenge_id")
      .eq("lecture_id", lectureId);

    if (existingError) {
      console.error("기존 챌린지 연결 조회 에러:", existingError);
      throw existingError;
    }

    const existingChallengeIds = existingLinks.map((link) => link.challenge_id);
    const newChallengeIds = data.challenges;

    // 삭제할 챌린지 연결 (제출이 없는 경우에만 삭제 가능)
    const challengesToRemove = existingChallengeIds.filter(
      (id) => !newChallengeIds.includes(id),
    );

    if (challengesToRemove.length > 0) {
      // 먼저 삭제 가능한 ChallengeLectures 조회
      const { data: challengeLectures, error: fetchError } = await supabase
        .from("ChallengeLectures")
        .select("id")
        .eq("lecture_id", lectureId)
        .in("challenge_id", challengesToRemove);

      if (fetchError) {
        console.error("챌린지 연결 조회 에러:", fetchError);
        throw fetchError;
      }

      // 제출이 있는 ChallengeLectures 조회
      const { data: submittedCLs, error: submissionError } = await supabase
        .from("Submissions")
        .select("challenge_lecture_id")
        .in(
          "challenge_lecture_id",
          challengeLectures?.map((cl) => cl.id) || [],
        );

      if (submissionError) {
        console.error("제출 정보 조회 에러:", submissionError);
        throw submissionError;
      }

      // 제출이 없는 ChallengeLectures ID만 필터링
      const submittedIds = new Set(
        submittedCLs?.map((s) => s.challenge_lecture_id) || [],
      );
      const deletableIds =
        challengeLectures
          ?.filter((cl) => !submittedIds.has(cl.id))
          .map((cl) => cl.id) || [];

      if (deletableIds.length > 0) {
        // 제출이 없는 챌린지 연결만 삭제
        const { error: deleteError } = await supabase
          .from("ChallengeLectures")
          .delete()
          .in("id", deletableIds);

        if (deleteError) {
          console.error("챌린지 연결 삭제 에러:", deleteError);
          throw deleteError;
        }
      }
    }

    // 새로운 챌린지 연결 정보 추가 및 업데이트
    if (data.challenges && data.challenges.length > 0) {
      // 각 챌린지의 open_date 가져오기
      const { data: challengesData, error: challengesError } = await supabase
        .from("Challenges")
        .select("id, open_date")
        .in("id", data.challenges);

      if (challengesError) {
        console.error("챌린지 정보 조회 에러:", challengesError);
        throw challengesError;
      }

      for (const challengeId of data.challenges) {
        const challenge = challengesData.find(
          (c) => c.id.toString() === challengeId.toString(),
        );
        const openDate = new Date(challenge?.open_date || "");
        const sequence =
          data.challengeOrders?.find((co) => co.challengeId === challengeId)
            ?.order || 1;

        // open_at 계산
        const openAt = new Date(openDate);
        openAt.setDate(openAt.getDate() + (sequence - 1));

        // due_at 계산
        const dueAt = new Date(openAt);
        dueAt.setDate(dueAt.getDate() + 1);

        // 기존 연결이 있는지 확인
        const { data: existingLink, error: checkError } = await supabase
          .from("ChallengeLectures")
          .select("id")
          .eq("lecture_id", lectureId)
          .eq("challenge_id", challengeId)
          .single();

        if (checkError && checkError.code !== "PGRST116") {
          // PGRST116는 결과가 없을 때의 에러 코드
          console.error("기존 연결 확인 에러:", checkError);
          throw checkError;
        }

        if (existingLink) {
          // 기존 연결이 있으면 업데이트
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
            console.error("챌린지 연결 업데이트 에러:", updateError);
            throw updateError;
          }
        } else {
          // 기존 연결이 없으면 새로 추가
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
            console.error("챌린지 연결 추가 에러:", insertError);
            throw insertError;
          }
        }
      }
    }

    // 과제 정보 업데이트
    const { error: assignmentError } = await supabase
      .from("Assignments")
      .update({
        title: data.assignmentTitle,
        contents: data.assignment,
      })
      .eq("lecture_id", lectureId);

    if (assignmentError) {
      console.error("과제 업데이트 에러:", assignmentError);
      throw assignmentError;
    }

    console.log("수정된 강의:", updatedLecture);
    return updatedLecture;
  } catch (error) {
    console.error("강의 업데이트 실패", error);
    throw error;
  }
}

async function deleteStorageFile(url: string): Promise<void> {
  const urlMatch = url.match(/\/videos\/(.+)$/);
  if (urlMatch && urlMatch[1]) {
    const filePath = urlMatch[1].replace(/^\//, "");
    console.log("삭제할 파일 경로:", filePath);

    const { data: deleteData, error: deleteError } = await supabase.storage
      .from("videos")
      .remove([`${filePath}`]);

    if (deleteError) {
      console.error("파일 삭제 에러:", deleteError);
      console.error("에러 상세:", JSON.stringify(deleteError, null, 2));
    } else {
      console.log("파일 삭제 성공:", deleteData);
    }
  }
}

export async function deleteLecture(lectureId: number) {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("사용자 인증이 필요합니다.");
  }

  try {
    // 먼저 해당 ID의 강의가 존재하는지 확인
    const { data: lecture, error: checkError } = await supabase
      .from("Lectures")
      .select("id, url, upload_type")
      .eq("id", lectureId)
      .single();

    if (checkError || !lecture) {
      throw new Error(`ID가 ${lectureId}인 강의를 찾을 수 없습니다.`);
    }

    // Supabase Storage에 저장된 파일이 있는 경우 삭제
    if (lecture.upload_type === 1 && lecture.url) {
      await deleteStorageFile(lecture.url);
    }

    // 먼저 ChallengeLectures 테이블에서 관련 레코드 삭제
    const { error: challengeDeleteError } = await supabase
      .from("ChallengeLectures")
      .delete()
      .eq("lecture_id", lectureId);

    if (challengeDeleteError) {
      console.error("챌린지 연결 삭제 실패:", challengeDeleteError);
      throw challengeDeleteError;
    }

    // Assignments 테이블에서 관련 레코드 삭제
    const { error: assignmentDeleteError } = await supabase
      .from("Assignments")
      .delete()
      .eq("lecture_id", lectureId);

    if (assignmentDeleteError) {
      console.error("과제 삭제 실패:", assignmentDeleteError);
      throw assignmentDeleteError;
    }

    // 마지막으로 강의 삭제
    const { error: deleteError } = await supabase
      .from("Lectures")
      .delete()
      .eq("id", lectureId);

    if (deleteError) throw deleteError;

    return { success: true };
  } catch (error) {
    console.error("강의 삭제 실패", error);
    throw error;
  }
}

export async function getLectureChallenges(
  lectureId: number,
): Promise<Challenge[]> {
  try {
    const { data, error } = await supabase
      .from("ChallengeLectures")
      .select(
        `
        challenge_id,
        Challenges (
          id,
          name
        )
      `,
      )
      .eq("lecture_id", lectureId)
      .returns<{ challenge_id: number; Challenges: Challenge }[]>();

    if (error) throw error;

    // Challenges 테이블의 데이터만 추출
    const challenges = data?.map((item) => item.Challenges) || [];
    console.log("강의 챌린지 목록:", challenges);

    return challenges;
  } catch (error) {
    console.error("챌린지 데이터 조회 실패:", error);
    return [];
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
          challenge_id,
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
        console.log("강의를 찾을 수 없습니다:", lectureId);
        return null;
      }
      console.error("강의 상세 정보 조회 실패:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("강의 상세 정보 조회 실패:", error);
    return null;
  }
}

export async function getUserLectures(userId: number) {
  try {
    // 1. 먼저 사용자가 속한 모든 챌린지 ID를 조회
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

    if (challengeError) throw challengeError;
    if (!challengeData || challengeData.length === 0) {
      throw new Error("사용자가 속한 챌린지를 찾을 수 없습니다.");
    }

    // 서버 시간을 사용하여 현재 진행 중인 챌린지 필터링
    const { data: serverTime, error: timeError } = await supabase.rpc(
      "get_server_time",
    );
    if (timeError) throw timeError;

    const currentDate = serverTime.split("T")[0]; // 'YYYY-MM-DD' 형식으로 변환

    // 2. 현재 진행 중인 챌린지 ID만 필터링
    const activeChallengeIds = (challengeData as unknown as ChallengeUser[])
      .filter((challenge) => {
        if (!challenge.Challenges) {
          console.log("챌린지 데이터가 없습니다:", challenge);
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

    // 3. 활성화된 챌린지의 강의 목록을 조회
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

    if (lectureError) throw lectureError;

    const lectures =
      lectureData?.map((item) => ({
        ...item.Lectures,
        challenge_lecture_id: item.id,
        open_at: item.open_at,
        challenge_id: item.challenge_id,
      })) || [];

    console.log("사용자의 챌린지 강의 목록:", lectures);

    return lectures;
  } catch (error) {
    console.error("강의 데이터 조회 실패:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "사용자의 챌린지 강의 목록 조회 중 오류가 발생했습니다.",
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
      .returns<ChallengeLectureResponse[]>();

    if (error) throw error;

    // Lectures 데이터 추출 및 과제 정보 포함
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

    console.log("챌린지별 강의 목록:", lectures);
    return lectures;
  } catch (error) {
    console.error("챌린지별 강의 데이터 조회 실패:", error);
    return [];
  }
}
export async function uploadFile(file: File): Promise<string> {
  const fileExtension = file.name.split(".").pop();
  const timestamp = new Date().getTime();
  const randomString = Math.random().toString(36).substring(2, 15);
  const safeFileName = `${timestamp}-${randomString}.${fileExtension}`;

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("videos")
    .upload(`/${safeFileName}`, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });

  if (uploadError) throw uploadError;

  const {
    data: { publicUrl },
  } = supabase.storage.from("videos").getPublicUrl(uploadData.path);

  return publicUrl;
}
