
export interface RawMenuItem {
  name: string;
  price: number;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantityOrdered: number;
  quantityReceived: number;
}

export type SortableKey = 'name' | 'price';
export type SortDirection = 'ascending' | 'descending';

export interface SortConfig {
  key: SortableKey;
  direction: SortDirection;
}


// For potential future use with grounding, not used in current version
export interface GroundingChunkWeb {
  uri: string;
  title: string;
}
export interface GroundingChunk {
  web?: GroundingChunkWeb;
}