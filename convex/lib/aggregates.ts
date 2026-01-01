import { components } from '../_generated/api';
import { DataModel } from '../_generated/dataModel';
import { TableAggregate } from '@convex-dev/aggregate';

/**
 * Aggregate for counting content pieces by project.
 * Enables efficient O(log n) count queries instead of table scans.
 */
export const contentPiecesByProject = new TableAggregate<{
  Namespace: string; // projectId as string
  Key: number; // _creationTime for sorting
  DataModel: DataModel;
  TableName: 'contentPieces';
}>(components.aggregateBriefs, {
  namespace: (doc) => doc.projectId as unknown as string,
  sortKey: (doc) => doc._creationTime,
});

/**
 * Aggregate for counting keywords by project.
 * Enables efficient O(log n) count queries instead of table scans.
 */
export const keywordsByProject = new TableAggregate<{
  Namespace: string; // projectId as string
  Key: number; // _creationTime for sorting
  DataModel: DataModel;
  TableName: 'keywords';
}>(components.aggregateKeywords, {
  namespace: (doc) => doc.projectId as unknown as string,
  sortKey: (doc) => doc._creationTime,
});
