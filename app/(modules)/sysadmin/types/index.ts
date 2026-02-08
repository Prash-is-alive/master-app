export interface UserRecord {
  _id: string;
  username: string;
  email?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserPayload {
  username: string;
  email?: string;
  password: string;
}

export interface UpdateUserPayload {
  username?: string;
  email?: string;
  password?: string;
}

