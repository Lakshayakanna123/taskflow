export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
}
