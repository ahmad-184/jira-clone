export type GitHubUser = {
  id: string;
  login: string;
  avatar_url: string;
  email: string;
};

export type GoogleUser = {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  email: string;
  email_verified: boolean;
  locale: string;
};
