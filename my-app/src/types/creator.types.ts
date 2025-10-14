// Creator Application types

export interface CreatorApplicationRequest {
  experience: string;
  portfolio?: string;
  motivation: string;
  social_media: Record<string, string>; // e.g., { facebook: "url", youtube: "url" }
  additional_info?: string;
}

export interface CreatorApplicationResponse {
  success: boolean;
  message: string;
  applicationId: string;
  status: string;
  submittedAt: string;
}

export interface MyApplicationStatus {
  applicationId: string;
  status: CreatorApplicationStatus;
  statusDescription: string;
  submittedAt: string | null;
  reviewedAt: string | null;
  reviewedBy: string | null;
  rejectionReason: string | null;
  experience: string;
  portfolio: string;
  motivation: string;
  socialMedia: string[];
  additionalInfo: string | null;
}

export enum CreatorApplicationStatus {
  Pending = "Pending",
  Approved = "Approved",
  Rejected = "Rejected",
}

export interface SocialMediaLinks {
  facebook?: string;
  youtube?: string;
  instagram?: string;
  tiktok?: string;
  twitter?: string;
  website?: string;
}
