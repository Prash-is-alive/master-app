/**
 * Sysadmin schema for the shared users database
 * Collection: sysadmins
 */

export interface Sysadmin {
  _id?: string;
  username: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Indexes to create for sysadmins collection:
 * - username: unique index
 */

