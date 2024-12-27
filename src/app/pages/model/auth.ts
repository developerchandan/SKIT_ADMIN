export class Auth {
  id?: string;
  name?: string;
  password?: string;
  email?: string  ;
  role:string | undefined
  phone?: string;
  token?: string;
  isEmployer?: true;
  street?: string;
  apartment?: string;
  zip?: string;
  city?: string;
  country?: string;
  isVerified?: boolean;
  userId: any;
  msg?:string;

}


export class User {
  id?: string;
  _id?:string;
  name?: string;
  password?: string;
  email?: string ;
  role?:string;
  phone?: string;
  token?: string;
  userId?: number;
  designation?: string;
  organization?: string;
  isCurrentCompany?: boolean;
  startDate?: Date;
  employment?:[];
  endDate?: Date;
  experience?: number;
  noticePeriod?: number;
  jobDescription?:string;
  agreeToTerms?: boolean;
  verificationToken?: string;
  msg?: string;
  isVerified?: any;


}


