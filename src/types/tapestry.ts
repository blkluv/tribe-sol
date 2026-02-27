export type TapestryExecution = "FAST_UNCONFIRMED" | "CONFIRMED" | "FINALIZED";

export interface TapestryCustomProperty {
  key: string;
  value: string;
}

export interface TapestryProfile {
  id: string;
  blockchain: string;
  walletAddress: string;
  username: string;
  bio?: string;
  image?: string;
  namespace: string;
  created_at: string;
  socialCounts?: {
    followers: number;
    following: number;
    posts: number;
  };
  customProperties?: TapestryCustomProperty[];
}

export interface TapestryContent {
  id: string;
  profileId: string;
  namespace: string;
  created_at: string;
  customProperties?: TapestryCustomProperty[];
}

export interface TapestryContentWithEngagement extends TapestryContent {
  likes: number;
  comments: number;
  isLiked?: boolean;
}

export interface TapestryLike {
  id: string;
  profileId: string;
  contentId: string;
  created_at: string;
}

export interface TapestryComment {
  id: string;
  profileId: string;
  contentId: string;
  text: string;
  created_at: string;
  profile?: TapestryProfile;
  replies?: TapestryComment[];
  replyCount?: number;
}

export interface TapestryFollowUser {
  id: string;
  username: string;
  walletAddress: string;
  bio?: string;
  image?: string;
}

export interface TapestryPaginatedResponse<T> {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
}

export interface TapestrySearchResult {
  profiles: TapestryProfile[];
}
