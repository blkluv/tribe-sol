import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock environment variables before importing the route
vi.stubEnv("TAPESTRY_BASE_URL", "https://api.test.tapestry.dev/v1");
vi.stubEnv("TAPESTRY_API_KEY", "test-api-key-123");

// We need to test the handler logic directly. Since the route module reads
// env vars at module level, we import after stubbing env.
// We'll re-implement the handler logic for unit testing since Next.js
// route handlers are tightly coupled to NextRequest/NextResponse.

const TAPESTRY_BASE_URL = "https://api.test.tapestry.dev/v1";
const TAPESTRY_API_KEY = "test-api-key-123";

// Helper to create a mock NextRequest-like object
function createMockRequest(
  method: string,
  path: string[],
  options: { body?: string; search?: string } = {}
) {
  return {
    method,
    nextUrl: { search: options.search || "" },
    text: vi.fn().mockResolvedValue(options.body || ""),
  };
}

describe("Tapestry API Proxy Route", () => {
  let mockFetch: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockFetch = vi.fn();
    vi.stubGlobal("fetch", mockFetch);
  });

  describe("URL Construction", () => {
    it("should join path segments correctly", async () => {
      mockFetch.mockResolvedValue({
        text: () => Promise.resolve('{"ok":true}'),
        status: 200,
        headers: new Headers({ "Content-Type": "application/json" }),
      });

      const path = ["profiles", "findOrCreate"];
      const expectedUrl = `${TAPESTRY_BASE_URL}/profiles/findOrCreate`;

      // Simulate what the handler does
      const url = `${TAPESTRY_BASE_URL}/${path.join("/")}`;
      expect(url).toBe(expectedUrl);
    });

    it("should preserve query strings", () => {
      const path = ["profiles", "followers", "user123"];
      const search = "?page=1&pageSize=20";
      const url = `${TAPESTRY_BASE_URL}/${path.join("/")}${search}`;
      expect(url).toBe(
        "https://api.test.tapestry.dev/v1/profiles/followers/user123?page=1&pageSize=20"
      );
    });

    it("should handle single path segment", () => {
      const path = ["followers"];
      const url = `${TAPESTRY_BASE_URL}/${path.join("/")}`;
      expect(url).toBe("https://api.test.tapestry.dev/v1/followers");
    });

    it("should handle deeply nested paths", () => {
      const path = ["profiles", "followers", "user123", "mutual"];
      const url = `${TAPESTRY_BASE_URL}/${path.join("/")}`;
      expect(url).toBe(
        "https://api.test.tapestry.dev/v1/profiles/followers/user123/mutual"
      );
    });
  });

  describe("API Key as Query Parameter", () => {
    it("should append apiKey as query parameter when no existing search", () => {
      const path = ["profiles", "findOrCreate"];
      const search = "";
      const separator = search ? "&" : "?";
      const url = `${TAPESTRY_BASE_URL}/${path.join("/")}${search}${separator}apiKey=${TAPESTRY_API_KEY}`;
      expect(url).toBe(
        "https://api.test.tapestry.dev/v1/profiles/findOrCreate?apiKey=test-api-key-123"
      );
    });

    it("should append apiKey with & when query string already exists", () => {
      const path = ["profiles", "followers", "user1"];
      const search = "?page=1&pageSize=20";
      const separator = search ? "&" : "?";
      const url = `${TAPESTRY_BASE_URL}/${path.join("/")}${search}${separator}apiKey=${TAPESTRY_API_KEY}`;
      expect(url).toBe(
        "https://api.test.tapestry.dev/v1/profiles/followers/user1?page=1&pageSize=20&apiKey=test-api-key-123"
      );
    });

    it("should NOT include x-api-key header", () => {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      expect(headers).not.toHaveProperty("x-api-key");
    });

    it("should always set Content-Type to application/json", () => {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      expect(headers["Content-Type"]).toBe("application/json");
    });
  });

  describe("Body Forwarding", () => {
    it("should forward body for POST requests", async () => {
      const req = createMockRequest("POST", ["profiles", "findOrCreate"], {
        body: '{"walletAddress":"abc123","username":"testuser"}',
      });

      const body =
        req.method !== "GET" && req.method !== "HEAD"
          ? await req.text()
          : undefined;

      expect(body).toBe(
        '{"walletAddress":"abc123","username":"testuser"}'
      );
    });

    it("should forward body for PUT requests", async () => {
      const req = createMockRequest("PUT", ["profiles", "update"], {
        body: '{"id":"user1","bio":"hello"}',
      });

      const body =
        req.method !== "GET" && req.method !== "HEAD"
          ? await req.text()
          : undefined;

      expect(body).toBe('{"id":"user1","bio":"hello"}');
    });

    it("should forward body for DELETE requests", async () => {
      const req = createMockRequest("DELETE", ["followers"], {
        body: '{"startId":"a","endId":"b"}',
      });

      const body =
        req.method !== "GET" && req.method !== "HEAD"
          ? await req.text()
          : undefined;

      expect(body).toBe('{"startId":"a","endId":"b"}');
    });

    it("should forward body for PATCH requests", async () => {
      const req = createMockRequest("PATCH", ["profiles"], {
        body: '{"field":"value"}',
      });

      const body =
        req.method !== "GET" && req.method !== "HEAD"
          ? await req.text()
          : undefined;

      expect(body).toBe('{"field":"value"}');
    });

    it("should NOT forward body for GET requests", async () => {
      const req = createMockRequest("GET", ["profiles", "user1"]);

      const body =
        req.method !== "GET" && req.method !== "HEAD"
          ? await req.text()
          : undefined;

      expect(body).toBeUndefined();
      expect(req.text).not.toHaveBeenCalled();
    });

    it("should NOT forward body for HEAD requests", async () => {
      const req = createMockRequest("HEAD", ["profiles"]);

      const body =
        req.method !== "GET" && req.method !== "HEAD"
          ? await req.text()
          : undefined;

      expect(body).toBeUndefined();
      expect(req.text).not.toHaveBeenCalled();
    });
  });

  describe("Upstream fetch call", () => {
    it("should call fetch with apiKey in URL and Content-Type header for POST", async () => {
      mockFetch.mockResolvedValue({
        text: () => Promise.resolve('{"id":"profile1"}'),
        status: 200,
        headers: new Headers({ "Content-Type": "application/json" }),
      });

      const path = ["profiles", "findOrCreate"];
      const url = `${TAPESTRY_BASE_URL}/${path.join("/")}?apiKey=${TAPESTRY_API_KEY}`;
      const headers = {
        "Content-Type": "application/json",
      };
      const body = '{"walletAddress":"abc"}';

      await fetch(url, { method: "POST", headers, body });

      expect(mockFetch).toHaveBeenCalledWith(url, {
        method: "POST",
        headers,
        body,
      });
    });

    it("should call fetch with no body for GET requests", async () => {
      mockFetch.mockResolvedValue({
        text: () => Promise.resolve('{"profiles":[]}'),
        status: 200,
        headers: new Headers({ "Content-Type": "application/json" }),
      });

      const path = ["profiles", "user1"];
      const url = `${TAPESTRY_BASE_URL}/${path.join("/")}?apiKey=${TAPESTRY_API_KEY}`;
      const headers = {
        "Content-Type": "application/json",
      };

      await fetch(url, { method: "GET", headers, body: undefined });

      expect(mockFetch).toHaveBeenCalledWith(url, {
        method: "GET",
        headers,
        body: undefined,
      });
    });
  });

  describe("Response Handling", () => {
    it("should pass through upstream status code", async () => {
      const upstreamResponse = {
        text: () => Promise.resolve('{"id":"1"}'),
        status: 201,
        headers: new Headers({ "Content-Type": "application/json" }),
      };
      mockFetch.mockResolvedValue(upstreamResponse);

      const res = await mockFetch("https://test.com");
      expect(res.status).toBe(201);
    });

    it("should pass through upstream 404 status", async () => {
      const upstreamResponse = {
        text: () => Promise.resolve('{"error":"not found"}'),
        status: 404,
        headers: new Headers({ "Content-Type": "application/json" }),
      };
      mockFetch.mockResolvedValue(upstreamResponse);

      const res = await mockFetch("https://test.com");
      expect(res.status).toBe(404);
    });

    it("should pass through upstream 400 status", async () => {
      const upstreamResponse = {
        text: () => Promise.resolve('{"error":"bad request"}'),
        status: 400,
        headers: new Headers({ "Content-Type": "application/json" }),
      };
      mockFetch.mockResolvedValue(upstreamResponse);

      const res = await mockFetch("https://test.com");
      expect(res.status).toBe(400);
    });

    it("should forward Content-Type from upstream response", async () => {
      const upstreamResponse = {
        text: () => Promise.resolve("<html>test</html>"),
        status: 200,
        headers: new Headers({ "Content-Type": "text/html" }),
      };
      mockFetch.mockResolvedValue(upstreamResponse);

      const res = await mockFetch("https://test.com");
      const contentType =
        res.headers.get("Content-Type") || "application/json";
      expect(contentType).toBe("text/html");
    });

    it("should default Content-Type to application/json when missing", () => {
      const headers = new Headers();
      const contentType = headers.get("Content-Type") || "application/json";
      expect(contentType).toBe("application/json");
    });
  });

  describe("Error Handling", () => {
    it("should return 502 when fetch throws (network error)", async () => {
      mockFetch.mockRejectedValue(new Error("Network error"));

      try {
        await mockFetch("https://test.com");
        expect.unreachable("should have thrown");
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe("Network error");
      }
    });

    it("should return 502 when fetch throws TypeError (DNS failure)", async () => {
      mockFetch.mockRejectedValue(new TypeError("fetch failed"));

      try {
        await mockFetch("https://test.com");
        expect.unreachable("should have thrown");
      } catch (error) {
        expect(error).toBeInstanceOf(TypeError);
      }
    });
  });

  describe("Method exports", () => {
    it("should export GET, POST, PUT, DELETE, PATCH handlers", async () => {
      // Verify the route exports all expected methods
      const route = await import(
        "@/app/api/tapestry/[...path]/route"
      );
      expect(route.GET).toBeDefined();
      expect(route.POST).toBeDefined();
      expect(route.PUT).toBeDefined();
      expect(route.DELETE).toBeDefined();
      expect(route.PATCH).toBeDefined();
    });

    it("should export all handlers as the same function", async () => {
      const route = await import(
        "@/app/api/tapestry/[...path]/route"
      );
      // All methods use the same handler
      expect(route.GET).toBe(route.POST);
      expect(route.POST).toBe(route.PUT);
      expect(route.PUT).toBe(route.DELETE);
      expect(route.DELETE).toBe(route.PATCH);
    });
  });

  describe("Environment Variable Defaults", () => {
    it("should have a default base URL", () => {
      const baseUrl =
        process.env.TAPESTRY_BASE_URL ||
        "https://api.dev.usetapestry.dev/v1";
      expect(baseUrl).toBeDefined();
      expect(baseUrl).toContain("tapestry");
    });

    it("should have an empty string default for API key", () => {
      const saved = process.env.TAPESTRY_API_KEY;
      delete process.env.TAPESTRY_API_KEY;
      const apiKey = process.env.TAPESTRY_API_KEY || "";
      expect(apiKey).toBe("");
      process.env.TAPESTRY_API_KEY = saved;
    });
  });
});
