import { BaseService } from './base.service';
import type { Sysadmin } from '../schemas/sysadmin';
import bcrypt from 'bcryptjs';

/**
 * Sysadmin service for sysadmin authentication
 * Uses the same users DB but a separate "sysadmins" collection
 */
export class SysadminService extends BaseService<Sysadmin> {
  constructor() {
    const usersDbName = process.env.USERS_DB_NAME;
    const sysadminCollectionName = process.env.SYSADMIN_COLLECTION_NAME;

    if (!usersDbName || !sysadminCollectionName) {
      throw new Error('sysadmin service configuration error');
    }
    
    super(usersDbName, sysadminCollectionName);
  }

  /**
   * Find sysadmin by username
   */
  async findByUsername(username: string): Promise<Sysadmin | null> {
    return this.findOne({ username } as any);
  }

  /**
   * Verify sysadmin credentials
   */
  async verifyCredentials(
    username: string,
    password: string
  ): Promise<{ admin: Omit<Sysadmin, 'password'> | null; error?: string }> {
    try {
      const admin = await this.findByUsername(username);

      if (!admin) {
        return { admin: null, error: 'Invalid username or password' };
      }

      const isValid = await bcrypt.compare(password, admin.password);

      if (!isValid) {
        return { admin: null, error: 'Invalid username or password' };
      }

      const { password: _, ...adminWithoutPassword } = admin;
      return { admin: adminWithoutPassword };
    } catch (error) {
      console.error('Error verifying sysadmin credentials:', error);
      return { admin: null, error: 'Failed to verify credentials' };
    }
  }
}

// Export singleton instance
export const sysadminService = new SysadminService();

