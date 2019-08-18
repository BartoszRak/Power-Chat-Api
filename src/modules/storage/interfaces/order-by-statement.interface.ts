import { OrderDirection } from './order-direction.enum'

export interface OrderByStatement {
  field: string,
  direction: OrderDirection,
}