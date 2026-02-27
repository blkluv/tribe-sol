import { describe, it, expect, vi, beforeEach } from "vitest";
import * as tapestry from "@/lib/tapestry";

// Mock global fetch
const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

// Helper: create a successful fetch response
function mockOkResponse(data: unknown, status = 200) {
  return {
    ok: true,
    status,
    json: () => Promise.resolve(data),
    text: () => Promise.resolve(JSON.stringify(data)),
  };
}

// Helper: create a failed fetch response
function mockErrorResponse(status: number, body = "Error") {
  return {
    ok: false,
    status,
    json: () => Promise.reject(new Error("not json")),
    text: () => Promise.resolve(body),
  };
}

const mockProfile = {
  id: "profile-1",
  blockchain: "SOLANA",
  walletAddress: "ABC123walletAddress",
  username: "testuser",
  bio: "Hello world",
  namespace: "tribe",
  created_at: "2025-01-01T00:00:00Z",
  socialCounts: { followers: 10, following: 5, posts: 3 },
};

describe("Tapestry Client Library", () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  // --- tapestryFetch (internal helper, tested via public functions) ---

  describe("tapestryFetch (via public API)", () => {
    it("should prefix all URLs with /api/tapestry", async () => {
      mockFetch.mockResolvedValue(mockOkResponse(mockProfile));

      await tapestry.getProfile("user1");

      expect(mockFetch).toHaveBeenCalledWith(
        "/api/tapestry/profiles/user1",
        expect.any(Object)
      );
    });

    it("should set Content-Type: application/json header", async () => {
      mockFetch.mockResolvedValue(mockOkResponse(mockProfile));

      await tapestry.getProfile("user1");

      const [, options] = mockFetch.mock.calls[0];
      expect(options.headers["Content-Type"]).toBe("application/json");
    });

    it("should throw on non-OK response with status and body", async () => {
      mockFetch.mockResolvedValue(
        mockErrorResponse(404, "Profile not found")
      );

      await expect(tapestry.getProfile("nonexistent")).rejects.toThrow(
        "Tapestry API error 404: Profile not found"
      );
    });

    it("should throw with 'Unknown error' when error body cannot be read", async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
        text: () => Promise.reject(new Error("read failed")),
      });

      await expect(tapestry.getProfile("bad")).rejects.toThrow(
        "Tapestry API error 500: Unknown error"
      );
    });
  });

  // --- Profiles ---

  describe("findOrCreateProfile", () => {
    it("should POST to /profiles/findOrCreate with wallet, username, blockchain, execution", async () => {
      mockFetch.mockResolvedValue(mockOkResponse(mockProfile));

      const result = await tapestry.findOrCreateProfile("wallet1", "user1");

      expect(mockFetch).toHaveBeenCalledWith(
        "/api/tapestry/profiles/findOrCreate",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({
            walletAddress: "wallet1",
            username: "user1",
            blockchain: "SOLANA",
            execution: "FAST_UNCONFIRMED",
          }),
        })
      );
      expect(result).toEqual(mockProfile);
    });

    it("should include bio when provided", async () => {
      mockFetch.mockResolvedValue(mockOkResponse(mockProfile));

      await tapestry.findOrCreateProfile("wallet1", "user1", "My bio");

      const [, options] = mockFetch.mock.calls[0];
      const body = JSON.parse(options.body);
      expect(body.bio).toBe("My bio");
    });

    it("should NOT include bio when not provided", async () => {
      mockFetch.mockResolvedValue(mockOkResponse(mockProfile));

      await tapestry.findOrCreateProfile("wallet1", "user1");

      const [, options] = mockFetch.mock.calls[0];
      const body = JSON.parse(options.body);
      expect(body).not.toHaveProperty("bio");
    });

    it("should NOT include bio when empty string (falsy)", async () => {
      mockFetch.mockResolvedValue(mockOkResponse(mockProfile));

      await tapestry.findOrCreateProfile("wallet1", "user1", "");

      const [, options] = mockFetch.mock.calls[0];
      const body = JSON.parse(options.body);
      expect(body).not.toHaveProperty("bio");
    });
  });

  describe("getProfile", () => {
    it("should GET /profiles/{profileId}", async () => {
      mockFetch.mockResolvedValue(mockOkResponse(mockProfile));

      const result = await tapestry.getProfile("profile-1");

      expect(mockFetch).toHaveBeenCalledWith(
        "/api/tapestry/profiles/profile-1",
        expect.objectContaining({ headers: expect.any(Object) })
      );
      expect(result).toEqual(mockProfile);
    });

    it("should URL-encode special characters in profileId", async () => {
      mockFetch.mockResolvedValue(mockOkResponse(mockProfile));

      await tapestry.getProfile("user/with spaces");

      expect(mockFetch).toHaveBeenCalledWith(
        "/api/tapestry/profiles/user%2Fwith%20spaces",
        expect.any(Object)
      );
    });
  });

  describe("searchProfiles", () => {
    it("should POST to /profiles/search with query", async () => {
      const searchResult = { profiles: [mockProfile] };
      mockFetch.mockResolvedValue(mockOkResponse(searchResult));

      const result = await tapestry.searchProfiles("testuser");

      expect(mockFetch).toHaveBeenCalledWith(
        "/api/tapestry/profiles/search",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ query: "testuser" }),
        })
      );
      expect(result.profiles).toHaveLength(1);
    });

    it("should return empty profiles array when no matches", async () => {
      mockFetch.mockResolvedValue(mockOkResponse({ profiles: [] }));

      const result = await tapestry.searchProfiles("nobody");
      expect(result.profiles).toHaveLength(0);
    });
  });

  describe("updateProfile", () => {
    it("should PUT to /profiles/update with id, execution, and updates", async () => {
      mockFetch.mockResolvedValue(
        mockOkResponse({ ...mockProfile, bio: "updated" })
      );

      await tapestry.updateProfile("profile-1", { bio: "updated" });

      expect(mockFetch).toHaveBeenCalledWith(
        "/api/tapestry/profiles/update",
        expect.objectContaining({
          method: "PUT",
          body: JSON.stringify({
            id: "profile-1",
            execution: "FAST_UNCONFIRMED",
            bio: "updated",
          }),
        })
      );
    });

    it("should support updating username, bio, image, and customProperties", async () => {
      mockFetch.mockResolvedValue(mockOkResponse(mockProfile));

      await tapestry.updateProfile("profile-1", {
        username: "newname",
        bio: "newbio",
        image: "https://img.com/pic.jpg",
        customProperties: [{ key: "city", value: "NYC" }],
      });

      const [, options] = mockFetch.mock.calls[0];
      const body = JSON.parse(options.body);
      expect(body.username).toBe("newname");
      expect(body.bio).toBe("newbio");
      expect(body.image).toBe("https://img.com/pic.jpg");
      expect(body.customProperties).toEqual([{ key: "city", value: "NYC" }]);
    });
  });

  // --- Followers ---

  describe("followUser", () => {
    it("should POST to /followers with startId, endId, blockchain, execution", async () => {
      mockFetch.mockResolvedValue(mockOkResponse({}));

      await tapestry.followUser("me", "them");

      expect(mockFetch).toHaveBeenCalledWith(
        "/api/tapestry/followers",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({
            startId: "me",
            endId: "them",
            blockchain: "SOLANA",
            execution: "FAST_UNCONFIRMED",
          }),
        })
      );
    });
  });

  describe("unfollowUser", () => {
    it("should DELETE to /followers with startId, endId, blockchain, execution", async () => {
      mockFetch.mockResolvedValue(mockOkResponse({}));

      await tapestry.unfollowUser("me", "them");

      expect(mockFetch).toHaveBeenCalledWith(
        "/api/tapestry/followers",
        expect.objectContaining({
          method: "DELETE",
          body: JSON.stringify({
            startId: "me",
            endId: "them",
            blockchain: "SOLANA",
            execution: "FAST_UNCONFIRMED",
          }),
        })
      );
    });
  });

  describe("getFollowers", () => {
    it("should GET /profiles/followers/{profileId} with default pagination", async () => {
      const data = { followers: [], total: 0 };
      mockFetch.mockResolvedValue(mockOkResponse(data));

      await tapestry.getFollowers("user1");

      expect(mockFetch).toHaveBeenCalledWith(
        "/api/tapestry/profiles/followers/user1?page=1&pageSize=20",
        expect.any(Object)
      );
    });

    it("should support custom pagination params", async () => {
      const data = { followers: [], total: 0 };
      mockFetch.mockResolvedValue(mockOkResponse(data));

      await tapestry.getFollowers("user1", 3, 50);

      expect(mockFetch).toHaveBeenCalledWith(
        "/api/tapestry/profiles/followers/user1?page=3&pageSize=50",
        expect.any(Object)
      );
    });

    it("should URL-encode profileId", async () => {
      mockFetch.mockResolvedValue(
        mockOkResponse({ followers: [], total: 0 })
      );

      await tapestry.getFollowers("user with spaces");

      const [url] = mockFetch.mock.calls[0];
      expect(url).toContain("user%20with%20spaces");
    });
  });

  describe("getFollowing", () => {
    it("should GET /profiles/following/{profileId} with default pagination", async () => {
      const data = { following: [], total: 0 };
      mockFetch.mockResolvedValue(mockOkResponse(data));

      await tapestry.getFollowing("user1");

      expect(mockFetch).toHaveBeenCalledWith(
        "/api/tapestry/profiles/following/user1?page=1&pageSize=20",
        expect.any(Object)
      );
    });
  });

  describe("checkFollowStatus", () => {
    it("should GET /followers/check with startId and endId query params", async () => {
      mockFetch.mockResolvedValue(
        mockOkResponse({ isFollowing: true })
      );

      const result = await tapestry.checkFollowStatus("me", "them");

      expect(mockFetch).toHaveBeenCalledWith(
        "/api/tapestry/followers/check?startId=me&endId=them",
        expect.any(Object)
      );
      expect(result.isFollowing).toBe(true);
    });

    it("should return false when not following", async () => {
      mockFetch.mockResolvedValue(
        mockOkResponse({ isFollowing: false })
      );

      const result = await tapestry.checkFollowStatus("me", "stranger");
      expect(result.isFollowing).toBe(false);
    });
  });

  // --- Content ---

  describe("createContent", () => {
    it("should POST to /contents/create with profileId, blockchain, execution, customProperties", async () => {
      const content = {
        id: "content-1",
        profileId: "user1",
        namespace: "tribe",
        created_at: "2025-01-01T00:00:00Z",
      };
      mockFetch.mockResolvedValue(mockOkResponse(content));

      const properties = [{ key: "text", value: "Hello world" }];
      const result = await tapestry.createContent("user1", properties);

      expect(mockFetch).toHaveBeenCalledWith(
        "/api/tapestry/contents/create",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({
            profileId: "user1",
            blockchain: "SOLANA",
            execution: "FAST_UNCONFIRMED",
            customProperties: properties,
          }),
        })
      );
      expect(result.id).toBe("content-1");
    });
  });

  describe("getContent", () => {
    it("should GET /contents/{contentId}", async () => {
      const content = {
        id: "content-1",
        profileId: "user1",
        namespace: "tribe",
        created_at: "2025-01-01T00:00:00Z",
      };
      mockFetch.mockResolvedValue(mockOkResponse(content));

      const result = await tapestry.getContent("content-1");

      expect(mockFetch).toHaveBeenCalledWith(
        "/api/tapestry/contents/content-1",
        expect.any(Object)
      );
      expect(result.id).toBe("content-1");
    });
  });

  describe("getContentByProfile", () => {
    it("should GET /contents/profile/{profileId} with default pagination", async () => {
      mockFetch.mockResolvedValue(
        mockOkResponse({ contents: [], total: 0 })
      );

      await tapestry.getContentByProfile("user1");

      expect(mockFetch).toHaveBeenCalledWith(
        "/api/tapestry/contents/profile/user1?page=1&pageSize=20",
        expect.any(Object)
      );
    });

    it("should support custom pagination", async () => {
      mockFetch.mockResolvedValue(
        mockOkResponse({ contents: [], total: 0 })
      );

      await tapestry.getContentByProfile("user1", 2, 10);

      expect(mockFetch).toHaveBeenCalledWith(
        "/api/tapestry/contents/profile/user1?page=2&pageSize=10",
        expect.any(Object)
      );
    });
  });

  describe("deleteContent", () => {
    it("should POST to /contents/delete with id, blockchain, execution", async () => {
      mockFetch.mockResolvedValue(mockOkResponse({}));

      await tapestry.deleteContent("content-1");

      expect(mockFetch).toHaveBeenCalledWith(
        "/api/tapestry/contents/delete",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({
            id: "content-1",
            blockchain: "SOLANA",
            execution: "FAST_UNCONFIRMED",
          }),
        })
      );
    });
  });

  // --- Likes ---

  describe("likeContent", () => {
    it("should POST to /likes with profileId, contentId, blockchain, execution", async () => {
      mockFetch.mockResolvedValue(mockOkResponse({}));

      await tapestry.likeContent("user1", "content-1");

      expect(mockFetch).toHaveBeenCalledWith(
        "/api/tapestry/likes",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({
            profileId: "user1",
            contentId: "content-1",
            blockchain: "SOLANA",
            execution: "FAST_UNCONFIRMED",
          }),
        })
      );
    });
  });

  describe("unlikeContent", () => {
    it("should DELETE to /likes with profileId, contentId, blockchain, execution", async () => {
      mockFetch.mockResolvedValue(mockOkResponse({}));

      await tapestry.unlikeContent("user1", "content-1");

      expect(mockFetch).toHaveBeenCalledWith(
        "/api/tapestry/likes",
        expect.objectContaining({
          method: "DELETE",
          body: JSON.stringify({
            profileId: "user1",
            contentId: "content-1",
            blockchain: "SOLANA",
            execution: "FAST_UNCONFIRMED",
          }),
        })
      );
    });
  });

  describe("checkLikeStatus", () => {
    it("should GET /likes/check with profileId and contentId query params", async () => {
      mockFetch.mockResolvedValue(mockOkResponse({ isLiked: true }));

      const result = await tapestry.checkLikeStatus("user1", "content-1");

      expect(mockFetch).toHaveBeenCalledWith(
        "/api/tapestry/likes/check?profileId=user1&contentId=content-1",
        expect.any(Object)
      );
      expect(result.isLiked).toBe(true);
    });

    it("should return false when not liked", async () => {
      mockFetch.mockResolvedValue(mockOkResponse({ isLiked: false }));

      const result = await tapestry.checkLikeStatus("user1", "content-2");
      expect(result.isLiked).toBe(false);
    });
  });

  describe("getLikeCount", () => {
    it("should GET /likes/count/{contentId}", async () => {
      mockFetch.mockResolvedValue(mockOkResponse({ count: 42 }));

      const result = await tapestry.getLikeCount("content-1");

      expect(mockFetch).toHaveBeenCalledWith(
        "/api/tapestry/likes/count/content-1",
        expect.any(Object)
      );
      expect(result.count).toBe(42);
    });

    it("should URL-encode contentId", async () => {
      mockFetch.mockResolvedValue(mockOkResponse({ count: 0 }));

      await tapestry.getLikeCount("content/with spaces");

      expect(mockFetch).toHaveBeenCalledWith(
        "/api/tapestry/likes/count/content%2Fwith%20spaces",
        expect.any(Object)
      );
    });
  });

  // --- Comments ---

  describe("createComment", () => {
    it("should POST to /comments with profileId, contentId, text, blockchain, execution", async () => {
      const comment = {
        id: "comment-1",
        profileId: "user1",
        contentId: "content-1",
        text: "Great post!",
        created_at: "2025-01-01T00:00:00Z",
      };
      mockFetch.mockResolvedValue(mockOkResponse(comment));

      const result = await tapestry.createComment(
        "user1",
        "content-1",
        "Great post!"
      );

      expect(mockFetch).toHaveBeenCalledWith(
        "/api/tapestry/comments",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({
            profileId: "user1",
            contentId: "content-1",
            text: "Great post!",
            blockchain: "SOLANA",
            execution: "FAST_UNCONFIRMED",
          }),
        })
      );
      expect(result.text).toBe("Great post!");
    });
  });

  describe("getComments", () => {
    it("should GET /comments with contentId and default pagination", async () => {
      mockFetch.mockResolvedValue(
        mockOkResponse({ comments: [], total: 0 })
      );

      await tapestry.getComments("content-1");

      expect(mockFetch).toHaveBeenCalledWith(
        "/api/tapestry/comments?contentId=content-1&page=1&pageSize=20",
        expect.any(Object)
      );
    });

    it("should support custom pagination", async () => {
      mockFetch.mockResolvedValue(
        mockOkResponse({ comments: [], total: 0 })
      );

      await tapestry.getComments("content-1", 2, 10);

      expect(mockFetch).toHaveBeenCalledWith(
        "/api/tapestry/comments?contentId=content-1&page=2&pageSize=10",
        expect.any(Object)
      );
    });
  });

  describe("deleteComment", () => {
    it("should DELETE /comments/{commentId} with blockchain and execution body", async () => {
      mockFetch.mockResolvedValue(mockOkResponse({}));

      await tapestry.deleteComment("comment-1");

      expect(mockFetch).toHaveBeenCalledWith(
        "/api/tapestry/comments/comment-1",
        expect.objectContaining({
          method: "DELETE",
          body: JSON.stringify({
            blockchain: "SOLANA",
            execution: "FAST_UNCONFIRMED",
          }),
        })
      );
    });

    it("should URL-encode commentId", async () => {
      mockFetch.mockResolvedValue(mockOkResponse({}));

      await tapestry.deleteComment("comment/special chars");

      const [url] = mockFetch.mock.calls[0];
      expect(url).toContain("comment%2Fspecial%20chars");
    });
  });
});
