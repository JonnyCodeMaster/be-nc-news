const db = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed.js");
const request = require("supertest");
const app = require("../app");
const fs = require("fs/promises");

beforeEach(() => seed(testData));
afterAll(() => db.end());

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

  test('404: responds with "Resource Not Found" when requesting an invalid endpoint resource', () => {
    return request(app)
      .get("/api/invalid-endpoint")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Resource Not Found");
      });
  });
});

describe("GET /api", () => {
  test("200 - responds with the file contents of endpoints.json", () => {
    return fs.readFile("endpoints.json", "utf8").then((fileContents) => {
      const endpoints = JSON.parse(fileContents);
      return request(app)
        .get("/api")
        .expect(200)
        .then(({ body }) => {
          expect(body.endpoints).toEqual(endpoints);
        });
    });
  });

  test('404: responds with "Resource Not Found" when requesting an invalid endpoint resource', () => {
    return request(app)
      .get("/invalid-endpoint")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Resource Not Found");
      });
  });
});
