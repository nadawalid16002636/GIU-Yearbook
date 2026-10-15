/*
FILE: src/app/models/staff.model.ts
WHAT: Defines the fields of a staff member.
WHY: Lets the app check that staff data has the correct structure.
*/

export interface StaffMember {
  id: number;
  name: string;
  department: string;
  role: string;
  bio: string;
  quote: string;
  photo: string;
  featured: boolean;
}