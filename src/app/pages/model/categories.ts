// categories.ts

// Interface for Category data
export class Category {
    _id?: string;
    name?: string;
    description?: string;
    subcategories?: Subcategory[];
    createdAt?:Date;
  }
  
  // Interface for Subcategory data
  export class Subcategory {
    _id?: string;
    name?: string;
    description?: string;
    categoryId: any;
    createdAt?:Date;
  }
  