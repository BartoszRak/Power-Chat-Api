import * as admin from 'firebase-admin';

import { Document } from './document';
import { StorageService } from './storage.service';
import { WhereStatement } from './interfaces/where-statement.interface';
import { OrderByStatement } from './interfaces/order-by-statement.interface';
import { WhereOperator } from './interfaces/where-operator.enum';

export abstract class Collection<TDocument extends Document> {
  protected constructor(
    private readonly db: StorageService,
    private readonly collectionName: string,
  ) {}

  private __limit: number = 25;
  private __whereStatements: WhereStatement[] = [];
  private __orderByStatements: OrderByStatement[] = [];

  public limit(limit: number): this {
    this.__limit = limit;
    return this;
  }

  public where(
    field: string,
    operator: '==' | '<=' | '>=' | 'array-contains' | '>' | '<',
    value: any,
  ): this {
    this.__whereStatements = [
      ...this.__whereStatements,
      { field: field, operator: operator, value: value } as WhereStatement,
    ];
    return this;
  }

  public orderBy(statement: OrderByStatement): this {
    this.__orderByStatements = [...this.__orderByStatements, statement];
    return this;
  }

  public async delete(documentId: string): Promise<boolean> {
    if (documentId) {
      throw new Error('Cannot delete document when ID is not provided.');
    }
    await this.baseQuery()
      .doc(documentId)
      .delete();
    return true;
  }

  public async update(data: TDocument): Promise<boolean> {
    if (!data.id) {
      throw new Error('Cannot update document when ID is not provided.');
    }
    data.updatedAt = this.db.timestamp;
    const newData: TDocument = { ...data };
    delete newData.id;
    await this.baseQuery()
      .doc(data.id)
      .update(newData);
    return true;
  }

  public async add(data: TDocument): Promise<string> {
    const newData: TDocument = {
      ...data,
      createdAt: this.db.timestamp,
      updatedAt: this.db.timestamp,
    };
    const ref: admin.firestore.DocumentReference = await this.baseQuery().add(
      newData,
    );
    return ref.id;
  }

  public async set(data: TDocument): Promise<boolean> {
    if (!data.id) {
      throw new Error('Cannot set document when ID is not provided.');
    }
    const newData: TDocument = {
      ...data,
      createdAt: this.db.timestamp,
      updatedAt: this.db.timestamp,
    };
    delete newData.id;
    await this.baseQuery()
      .doc(data.id)
      .set(newData);
    return true;
  }

  public async get(documentId: string): Promise<TDocument> {
    const result: admin.firestore.DocumentData = await this.baseQuery()
      .doc(documentId)
      .get();
    return this.map(result);
  }

  public async getAll(): Promise<TDocument[]> {
    const query: admin.firestore.Query = this.buildQuery();
    const result: admin.firestore.DocumentData = await query.get();
    return this.mapArray(result.docs);
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

    if (this.__whereStatements.length !== 0) {
      this.__whereStatements.forEach((whereStatement: WhereStatement) => {
        if (this.__orderByStatements.length !== 0) {
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
    } else if (
      this.__whereStatements.length === 0 &&
      this.__orderByStatements.length !== 0
    ) {
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
