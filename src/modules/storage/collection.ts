import * as admin from 'firebase-admin';

import { Document } from './document';
import { StorageService } from './storage.service';
import { WhereStatement } from './interfaces/where-statement.interface';
import { OrderByStatement } from './interfaces/order-by-statement.interface';

export abstract class Collection<TDocument extends Document> {
  protected constructor(
    private readonly db: StorageService,
    private readonly collectionName: string,
  ) {}

  private __limit: number;
  private __whereStatements: WhereStatement[];
  private __orderByStatements: OrderByStatement[];

  public limit(limit: number): this {
    this.__limit = limit;
    return this;
  }

  public where(statement: WhereStatement): this {
    this.__whereStatements = [...this.__whereStatements, statement];
    return this;
  }

  public orderBy(statement: OrderByStatement): this {
    this.__orderByStatements = [...this.__orderByStatements, statement];
    return this;
  }

  public async delete(documentId: string): Promise<boolean> {
    await this.baseQuery()
      .doc(documentId)
      .delete();
    return true;
  }

  public async update(data: TDocument): Promise<boolean> {
    data.updatedAt = this.db.timestamp;
    await this.baseQuery()
      .doc(data.id)
      .set(data);
    return true;
  }

  public async add(data: TDocument): Promise<string> {
    data.createdAt = this.db.timestamp;
    data.updatedAt = this.db.timestamp;
    const ref: admin.firestore.DocumentReference = await this.baseQuery()
      .add(data);
    return ref.id;
  }

  public async get(documentId: string): Promise<TDocument> {
    const result: admin.firestore.DocumentData = await this.baseQuery()
      .doc(documentId)
      .get();
    return this.map(result);
  }

  public async getAll(): Promise<TDocument> {
    const query: admin.firestore.Query = this.buildQuery();
    const result: admin.firestore.DocumentData = await query.get();
    return this.map(result.docs);
  }

  private map(doc: admin.firestore.DocumentData): TDocument {
    return {
      ...doc.data(),
      id: doc.ref.id,
    } as TDocument;
  }

  private mapArray(docs: admin.firestore.QueryDocumentSnapshot[]): TDocument[] {
    return docs.map(this.map);
  }

  private baseQuery(): any {
    return this.db.fs.collection(this.collectionName);
  }

  private buildQuery(): admin.firestore.Query {
    let query: admin.firestore.Query = this.baseQuery();

    if (this.__whereStatements) {
      this.__whereStatements.forEach((whereStatement: WhereStatement) => {
        if (this.__orderByStatements) {
          const validOrderBy: OrderByStatement = this.__orderByStatements.find(
            (orderByStatement: OrderByStatement) =>
              orderByStatement.field === whereStatement.field,
          );
          query = query
            .where(
              whereStatement.field,
              whereStatement.operator,
              whereStatement.value,
            )
            .orderBy(validOrderBy.field, validOrderBy.direction);
        } else {
          query = query.where(
            whereStatement.field,
            whereStatement.operator,
            whereStatement.value,
          );
        }
      });
    } else if (!this.__whereStatements && this.__orderByStatements) {
      this.__orderByStatements.forEach((orderByStatement: OrderByStatement) => {
        query = query.orderBy(
          orderByStatement.field,
          orderByStatement.direction,
        );
      });
    }

    if (this.__limit) {
      query.limit(this.__limit);
    }

    return query;
  }
}
