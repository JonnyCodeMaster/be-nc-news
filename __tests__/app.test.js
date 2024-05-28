const db = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed.js");
const request = require("supertest");
const app = require("../app");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("Test that appropriate error handling message is received when there is an error", () => {
  test('400: responds with "Bad Request" when requesting an invalid query', () => {
    return request(app)
      .get("/api/topics?sort_by=invalidColumn")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid Sort Request");
      });
  });

  test('404: responds with "Resource Not Found" when requesting an invalid endpoint resource', () => {
    return request(app)
      .get("/api/endpoint-does-not-exist")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Resource Not Found");
      });
  });
});

describe("GET /api/topics", () => {
  test("200 - responds with an array of topic objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const { topics } = body;
        expect(topics).toBeInstanceOf(Array);
        expect(topics).toHaveLength(3);
        topics.forEach((topic) => {
          expect(topic).toMatchObject({
            description: expect.any(String),
            slug: expect.any(String),
          });
        });
      });
  });
});
