export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export interface Template {
  id: string;
  thumbnail: string;
  values: { texts: string[] };
  template: { value: string; name: string; description: string };
  user: string;
  numberOfEdit: number;
  numberOfExport: number;
  numberOfCopy: number;
  created: string;
  updated: string;
  expand?: {
    user?: {
      id: string;
      name: string;
      avatar?: string;
    };
  };
}
