import { Gender } from "@/constants/enum/gender";
import { Role } from "@/constants/enum/role";
import { Status } from "@/constants/enum/status";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string | null;
  gender: Gender;
  roles: Role[];
  phone: string | null;
  address: string | null;
  city: string | null;
  avatarUrl: string | null;
  status: Status;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}
