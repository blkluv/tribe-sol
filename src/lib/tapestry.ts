import type {
  TapestryProfile,
  TapestryContent,
  TapestryComment,
  TapestryFollowUser,
  TapestryCustomProperty,
  TapestryExecution,
} from "@/types/tapestry";

const BLOCKCHAIN = "SOLANA";
const EXECUTION: TapestryExecution = "FAST_UNCONFIRMED";

async function tapestryFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `/api/tapestry${path}`;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  const res = await fetch(url, { ...options, headers });

  if (!res.ok) {
    const text = await res.text().catch(() => "Unknown error");
    throw new Error(`Tapestry API error ${res.status}: ${text}`);
  }

  return res.json();
}

// --- Profiles ---

export async function findOrCreateProfile(
  walletAddress: string,
  username: string,
  bio?: string
): Promise<TapestryProfile> {
  return tapestryFetch<TapestryProfile>("/profiles/findOrCreate", {
    method: "POST",
    body: JSON.stringify({
      walletAddress,
      username,
      blockchain: BLOCKCHAIN,
      execution: EXECUTION,
      ...(bio ? { bio } : {}),
    }),
  });
}

export async function getProfile(
  profileId: string
): Promise<TapestryProfile> {
  return tapestryFetch<TapestryProfile>(
    `/profiles/${encodeURIComponent(profileId)}`
  );
}

export async function searchProfiles(
  query: string
): Promise<{ profiles: TapestryProfile[] }> {
  return tapestryFetch<{ profiles: TapestryProfile[] }>("/profiles/search", {
    method: "POST",
    body: JSON.stringify({ query }),
  });
}

export async function updateProfile(
  profileId: string,
  updates: {
    username?: string;
    bio?: string;
    image?: string;
    customProperties?: TapestryCustomProperty[];
  }
): Promise<TapestryProfile> {
  return tapestryFetch<TapestryProfile>("/profiles/update", {
    method: "PUT",
    body: JSON.stringify({
      id: profileId,
      execution: EXECUTION,
      ...updates,
    }),
  });
}

// --- Followers ---

export async function followUser(
  followerProfileId: string,
  followingProfileId: string
): Promise<void> {
  await tapestryFetch("/followers", {
    method: "POST",
    body: JSON.stringify({
      startId: followerProfileId,
      endId: followingProfileId,
      blockchain: BLOCKCHAIN,
      execution: EXECUTION,
    }),
  });
}

export async function unfollowUser(
  followerProfileId: string,
  followingProfileId: string
): Promise<void> {
  await tapestryFetch("/followers", {
    method: "DELETE",
    body: JSON.stringify({
      startId: followerProfileId,
      endId: followingProfileId,
      blockchain: BLOCKCHAIN,
      execution: EXECUTION,
    }),
  });
}

export async function getFollowers(
  profileId: string,
  page = 1,
  pageSize = 20
): Promise<{ followers: TapestryFollowUser[]; total: number }> {
  return tapestryFetch(
    `/profiles/followers/${encodeURIComponent(profileId)}?page=${page}&pageSize=${pageSize}`
  );
}

export async function getFollowing(
  profileId: string,
  page = 1,
  pageSize = 20
): Promise<{ following: TapestryFollowUser[]; total: number }> {
  return tapestryFetch(
    `/profiles/following/${encodeURIComponent(profileId)}?page=${page}&pageSize=${pageSize}`
  );
}

export async function checkFollowStatus(
  followerProfileId: string,
  followingProfileId: string
): Promise<{ isFollowing: boolean }> {
  return tapestryFetch(
    `/followers/check?startId=${encodeURIComponent(followerProfileId)}&endId=${encodeURIComponent(followingProfileId)}`
  );
}

// --- Content ---

export async function createContent(
  profileId: string,
  properties: TapestryCustomProperty[]
): Promise<TapestryContent> {
  return tapestryFetch<TapestryContent>("/contents/create", {
    method: "POST",
    body: JSON.stringify({
      profileId,
      blockchain: BLOCKCHAIN,
      execution: EXECUTION,
      customProperties: properties,
    }),
  });
}

export async function getContent(
  contentId: string
): Promise<TapestryContent> {
  return tapestryFetch<TapestryContent>(
    `/contents/${encodeURIComponent(contentId)}`
  );
}

export async function getContentByProfile(
  profileId: string,
  page = 1,
  pageSize = 20
): Promise<{ contents: TapestryContent[]; total: number }> {
  return tapestryFetch(
    `/contents/profile/${encodeURIComponent(profileId)}?page=${page}&pageSize=${pageSize}`
  );
}

export async function deleteContent(contentId: string): Promise<void> {
  await tapestryFetch("/contents/delete", {
    method: "POST",
    body: JSON.stringify({
      id: contentId,
      blockchain: BLOCKCHAIN,
      execution: EXECUTION,
    }),
  });
}

// --- Likes ---

export async function likeContent(
  profileId: string,
  contentId: string
): Promise<void> {
  await tapestryFetch("/likes", {
    method: "POST",
    body: JSON.stringify({
      profileId,
      contentId,
      blockchain: BLOCKCHAIN,
      execution: EXECUTION,
    }),
  });
}

export async function unlikeContent(
  profileId: string,
  contentId: string
): Promise<void> {
  await tapestryFetch("/likes", {
    method: "DELETE",
    body: JSON.stringify({
      profileId,
      contentId,
      blockchain: BLOCKCHAIN,
      execution: EXECUTION,
    }),
  });
}

export async function checkLikeStatus(
  profileId: string,
  contentId: string
): Promise<{ isLiked: boolean }> {
  return tapestryFetch(
    `/likes/check?profileId=${encodeURIComponent(profileId)}&contentId=${encodeURIComponent(contentId)}`
  );
}

export async function getLikeCount(
  contentId: string
): Promise<{ count: number }> {
  return tapestryFetch(`/likes/count/${encodeURIComponent(contentId)}`);
}

// --- Comments ---

export async function createComment(
  profileId: string,
  contentId: string,
  text: string
): Promise<TapestryComment> {
  return tapestryFetch<TapestryComment>("/comments", {
    method: "POST",
    body: JSON.stringify({
      profileId,
      contentId,
      text,
      blockchain: BLOCKCHAIN,
      execution: EXECUTION,
    }),
  });
}

export async function getComments(
  contentId: string,
  page = 1,
  pageSize = 20
): Promise<{ comments: TapestryComment[]; total: number }> {
  return tapestryFetch(
    `/comments?contentId=${encodeURIComponent(contentId)}&page=${page}&pageSize=${pageSize}`
  );
}

export async function deleteComment(commentId: string): Promise<void> {
  await tapestryFetch(`/comments/${encodeURIComponent(commentId)}`, {
    method: "DELETE",
    body: JSON.stringify({
      blockchain: BLOCKCHAIN,
      execution: EXECUTION,
    }),
  });
}
