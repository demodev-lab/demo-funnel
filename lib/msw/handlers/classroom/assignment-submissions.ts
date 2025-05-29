// import { Submission, SubmissionRequest, AssignmentResponse } from '@/apis/assignment';
import { http, HttpResponse } from "msw";

const assignmentData = {
  title: "React 컴포넌트 최적화 구현하기",
  submissions: [
    {
      id: 1,
      user: "김코딩",
      time: "2시간 전",
      text: "React 컴포넌트 최적화 과제 제출합니다. useMemo와 useCallback을 활용한 최적화 예제를 구현했습니다.",
      link: "https://github.com/kimcoding/react-optimization-example",
      linkType: "GitHub",
    },
    {
      id: 2,
      user: "이리액트",
      time: "3시간 전",
      text: "메모이제이션을 활용한 렌더링 최적화 과제입니다. 피드백 부탁드립니다!",
      link: "https://codesandbox.io/s/react-optimization-demo-x7y9z2",
      linkType: "CodeSandbox",
    },
    {
      id: 3,
      user: "박자바",
      time: "어제",
      text: "React.memo를 사용한 컴포넌트 최적화 예제입니다. 불필요한 리렌더링을 방지하는 방법을 구현했습니다.",
      link: "https://codepen.io/parkjava/pen/abcdef",
      linkType: "CodePen",
    },
  ],
};

// export const assignmentSubmissionHandlers = [
//   // 과제 제출 목록 조회
//   http.get("/api/classroom/assignment", ({ request }) => {
//     const authHeader = request.headers.get('Authorization');
//     if (!authHeader?.startsWith('Bearer ')) {
//       return new HttpResponse(null, { status: 401 });
//     }

//     return HttpResponse.json(assignmentData);
//   }),

//   // 과제 제출
//   http.post("/api/classroom/assignment", async ({ request }) => {
//     const authHeader = request.headers.get('Authorization');
//     if (!authHeader?.startsWith('Bearer ')) {
//       return new HttpResponse(null, { status: 401 });
//     }

//     const body = await request.json();
//     // const { name, email, link, text } = body;

//     // 링크 타입 결정
//     let linkType = "링크";
//     if (link.includes("github.com")) linkType = "GitHub";
//     else if (link.includes("codesandbox.io")) linkType = "CodeSandbox";
//     else if (link.includes("codepen.io")) linkType = "CodePen";
//     else if (link.includes("replit.com")) linkType = "Replit";
//     else if (link.includes("stackblitz.com")) linkType = "StackBlitz";

//     const newSubmission = {
//       id: assignmentData.submissions.length + 1,
//       user: name,
//       time: "방금 전",
//       text,
//       link,
//       linkType,
//     };

//     assignmentData.submissions = [newSubmission, ...assignmentData.submissions];

//     return HttpResponse.json(newSubmission, { status: 201 });
//   }),
// ]; 