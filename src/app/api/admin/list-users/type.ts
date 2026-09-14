export type User = {
  id: string;
  email: string;
  last_sign_in_at: string | null;
  created_at: string;
  avatar_url: string | undefined;
  display_name: string | null;
  is_online: boolean;
  authority: "user" | "admin";
};
