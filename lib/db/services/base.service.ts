import { Db, Collection, Filter, UpdateFilter, FindOptions, ObjectId } from 'mongodb';
import { getDb } from '../mongodb';

/**
 * Base service class for database operations
 * Provides common CRUD operations that can be extended by module-specific services
 */
export class BaseService<T extends { _id?: string | ObjectId }> {
  protected dbName: string;
  protected collectionName: string;

  constructor(dbName: string, collectionName: string) {
    this.dbName = dbName;
    this.collectionName = collectionName;
  }

  /**
   * Get the database instance
   */
  protected async getDb(): Promise<Db> {
    return getDb(this.dbName);
  }

  /**
   * Get the collection instance
   */
  protected async getCollection(): Promise<Collection<T>> {
    const db = await this.getDb();
    return db.collection<T>(this.collectionName);
  }

  /**
   * Find a single document by filter
   */
  async findOne(filter: Filter<T>, options?: FindOptions): Promise<T | null> {
    try {
      const collection = await this.getCollection();
      const result = await collection.findOne(filter, options);
      return result ? this.formatDocument(result) : null;
    } catch (error) {
      console.error(`Error finding document in ${this.collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Find multiple documents by filter
   */
  async findMany(
    filter: Filter<T> = {},
    options?: FindOptions
  ): Promise<T[]> {
    try {
      const collection = await this.getCollection();
      const results = await collection.find(filter, options).toArray();
      return results.map(doc => this.formatDocument(doc));
    } catch (error) {
      console.error(`Error finding documents in ${this.collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Find a document by ID
   */
  async findById(id: string | ObjectId): Promise<T | null> {
    try {
      const objectId = typeof id === 'string' ? new ObjectId(id) : id;
      return this.findOne({ _id: objectId } as Filter<T>);
    } catch (error) {
      console.error(`Error finding document by ID in ${this.collectionName}:`, error);
      return null;
    }
  }

  /**
   * Create a new document
   */
  async create(data: Omit<T, '_id'>): Promise<T> {
    try {
      const collection = await this.getCollection();
      const result = await collection.insertOne(data as any);
      
      if (!result.insertedId) {
        throw new Error('Failed to create document');
      }

      const created = await this.findById(result.insertedId);
      if (!created) {
        throw new Error('Failed to retrieve created document');
      }

      return created;
    } catch (error) {
      console.error(`Error creating document in ${this.collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Create multiple documents
   */
  async createMany(data: Omit<T, '_id'>[]): Promise<T[]> {
    try {
      const collection = await this.getCollection();
      const result = await collection.insertMany(data as any[]);
      
      const ids = Object.values(result.insertedIds);
      const created = await this.findMany({
        _id: { $in: ids }
      } as Filter<T>);

      return created;
    } catch (error) {
      console.error(`Error creating documents in ${this.collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Update a document by filter
   */
  async updateOne(
    filter: Filter<T>,
    update: UpdateFilter<T>
  ): Promise<T | null> {
    try {
      const collection = await this.getCollection();
      const updateFilter: UpdateFilter<T> = {
        ...update,
        $set: {
          ...(update as any).$set,
          updatedAt: new Date(),
        },
      } as UpdateFilter<T>;
      
      const result = await collection.findOneAndUpdate(
        filter,
        updateFilter,
        { returnDocument: 'after' }
      );

      return result ? this.formatDocument(result) : null;
    } catch (error) {
      console.error(`Error updating document in ${this.collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Update a document by ID
   */
  async updateById(id: string | ObjectId, update: Partial<T>): Promise<T | null> {
    try {
      const objectId = typeof id === 'string' ? new ObjectId(id) : id;
      return this.updateOne({ _id: objectId } as Filter<T>, update as UpdateFilter<T>);
    } catch (error) {
      console.error(`Error updating document by ID in ${this.collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Delete a document by filter
   */
  async deleteOne(filter: Filter<T>): Promise<boolean> {
    try {
      const collection = await this.getCollection();
      const result = await collection.deleteOne(filter);
      return result.deletedCount > 0;
    } catch (error) {
      console.error(`Error deleting document in ${this.collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Delete a document by ID
   */
  async deleteById(id: string | ObjectId): Promise<boolean> {
    try {
      const objectId = typeof id === 'string' ? new ObjectId(id) : id;
      return this.deleteOne({ _id: objectId } as Filter<T>);
    } catch (error) {
      console.error(`Error deleting document by ID in ${this.collectionName}:`, error);
      return false;
    }
  }

  /**
   * Count documents matching filter
   */
  async count(filter: Filter<T> = {}): Promise<number> {
    try {
      const collection = await this.getCollection();
      return collection.countDocuments(filter);
    } catch (error) {
      console.error(`Error counting documents in ${this.collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Check if a document exists
   */
  async exists(filter: Filter<T>): Promise<boolean> {
    try {
      const count = await this.count(filter);
      return count > 0;
    } catch (error) {
      console.error(`Error checking document existence in ${this.collectionName}:`, error);
      return false;
    }
  }

  /**
   * Format document (convert ObjectId to string, etc.)
   */
  protected formatDocument(doc: any): T {
    if (doc?._id) {
      return {
        ...doc,
        _id: doc._id.toString(),
      } as T;
    }
    return doc as T;
  }
}

