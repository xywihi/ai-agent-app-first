export type User = {
  id: string;
  email: string | undefined;
  last_sign_in_at: string | undefined;
  created_at: string;
  avatar_url: string | undefined;
  display_name: string | undefined;
  is_online: boolean;
  authority: string;
};
