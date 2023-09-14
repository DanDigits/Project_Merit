export interface Report {
  id?: number;
  email: string;
  title: string;
  quarter: string;
  date: string;
  report: string;
}

export interface User {
  id?: number;
  email: string;
  firstName: string;
  lastName: string;
  suffix: string;
  rank: string;
  reportType: string;
  password: string;
}
