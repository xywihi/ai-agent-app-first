export interface Profiles {
  id: string;
  display_name: string;
  avatar_url: string;
  bio?: string;
  created_at?: string;
  updated_at?: string;
}

export interface UserMetadata {
  email: string;
  email_verified: boolean;
  phone_verified: boolean;
  sub: string;
  username: string;
}
