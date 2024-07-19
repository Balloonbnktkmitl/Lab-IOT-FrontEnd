export interface Book {
  id: number;
  title: string;
  author: string;
  year: number;
  is_published: boolean;
}

export interface Menu {
  id: number;
  name: string;
  price: number;
  detail: string;
  ingredient: string;
  is_available: boolean;
}

export interface Order {
  id: number;
  name: string;
  total: number;
  price: number;
}