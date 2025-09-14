// types/course.ts
export interface Course {
  _id: string;
  title: string;
  description: string;
  price: number;
  discountPrice: number;
  lessonsCount: number;
  rating: number;
  category?: { _id: string; name: string };
  thumbnail?: string;
}
