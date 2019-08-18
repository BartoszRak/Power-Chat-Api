import { WhereOperator } from './where-operator.enum'

export interface WhereStatement {
  field: string,
  operator: WhereOperator,
  value: any,
}