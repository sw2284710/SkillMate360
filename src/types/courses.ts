// types/course.ts
export interface FormData {
  title: string;
  description: string;
  category: string;
  price: number;
  lessonsCount: number;
  discountPrice?: number | null;
  rating?: number | null;
}
