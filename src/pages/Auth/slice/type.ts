import type { User } from "@/types/types";

export type AuthState = {
  user: Partial<User> | null;
  isFetchingUser: boolean;
};
