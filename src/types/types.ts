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

export interface FilterState {
  search: string;
  dateRange: string;
  creator: string;
  minEdits: number | null;
  maxEdits: number | null;
  sortBy: string;
  sortOrder: "asc" | "desc";
  user: string;
}
export interface Template {
  id: string;
  thumbnail: string;
  values: { texts: TextNode[] };
  template: {
    value: string;
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
  publicLink?: string;
  name: string;
  description?: string;
}

export type Actions =
  | "edit"
  | "copy"
  | "delete"
  | "share"
  | "create_public_link";
