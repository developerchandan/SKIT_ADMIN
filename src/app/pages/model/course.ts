
export interface Course {
   
    uniqueCourseName: string;
    id:string;
    _id:string;
    title: string;
    category: string;
    subCategory: string;
    level: string;
    description: string;
    videoUrl: string;
    tags: string[];
    price: number;
    discount: number;
    expireDate: Date;
    coverImage: string;
    instructor?:any;
    
  }
  