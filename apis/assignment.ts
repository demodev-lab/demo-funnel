import axios from 'axios';

export interface Submission {
  id: number;
  user: string;
  time: string;
  text: string;
  link: string;
  linkType: string;
}

export interface SubmissionRequest {
  name: string;
  email: string;
  link: string;
  text: string;
}

export const getAssignment = async () => {
  const { data } = await axios.get<Submission[]>('/api/classroom/assignment', {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    },
  });
  return data;
};

export const postAssignment = async (submission: SubmissionRequest) => {
  const { data } = await axios.post<Submission>('/api/classroom/assignment', submission, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      "Content-Type": "application/json",
    },
  });
  return data;
}; 