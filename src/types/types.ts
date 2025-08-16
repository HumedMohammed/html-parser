export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export interface TextNode {
  id: string;
  value: string;
  label?: string;
}

export interface Template {
  id: string;
  thumbnail: string;
  values: { texts: TextNode[] };
  template: {
    value: string;
    name: string;
    description?: string;
    original: string;
  };
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
