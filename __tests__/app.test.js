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

describe("GET /api/articles/:article_id", () => {
  test("200 - accepts an article_id and responds with the correct article information", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual(
          expect.objectContaining({
            author: expect.any(String),
            title: expect.any(String),
            article_id: 1,
            body: expect.any(String),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
          })
        );
      });
  });

  test("400 - responds with 'Bad Request' when the article_id requested is invalid", () => {
    return request(app)
      .get("/api/articles/invalid")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });

  test("404 - responds with 'Resource Not Found' when the article_id requested does not exist", () => {
    return request(app)
      .get("/api/articles/999999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Resource Not Found");
      });
  });
});

describe("GET /api/articles", () => {
  test("200 - responds with an array of article objects with the correct properties", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeInstanceOf(Array);
        expect(body.articles).toHaveLength(13);
        body.articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              author: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
              comment_count: expect.any(String),
            })
          );
          expect(article).not.toHaveProperty("body");
        });
      });
  });

  test("200 - responds with the correct comment_count for specific articles", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        const articleId1 = articles.find((article) => article.article_id === 1);
        const articleId9 = articles.find((article) => article.article_id === 9);
        expect(articleId1).toBeDefined();
        expect(articleId1.comment_count).toEqual("11");
        expect(articleId9).toBeDefined();
        expect(articleId9.comment_count).toEqual("2");
      });
  });

  test("200 - responds with an array of article objects correctly sorted by created_at (date) descending", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        expect(articles).toBeInstanceOf(Array);
        expect(articles).not.toHaveLength(0);

        for (let i = 0; i < articles.length - 1; i++) {
          expect(
            new Date(articles[i].created_at).getTime()
          ).toBeGreaterThanOrEqual(
            new Date(articles[i + 1].created_at).getTime()
          );
        }
      });
  });

  test("404 - responds with 'Resource Not Found' when endpoint is invalid", () => {
    return request(app)
      .get("/api/invalid-endpoint")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Resource Not Found");
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("200 - accepts an article_id and responds with an array of comment objects", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const comments = body.comments;
        expect(comments).toBeInstanceOf(Array);
        expect(comments).toHaveLength(11);
        body.comments.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              article_id: 1,
            })
          );
        });
      });
  });

  test("200 - responds with the correct array length for the article_id passed", () => {
    return request(app)
      .get("/api/articles/3/comments")
      .expect(200)
      .then(({ body }) => {
        const comments = body.comments;
        expect(comments).toBeInstanceOf(Array);
        expect(comments).toHaveLength(2);
      });
  });

  test("200 - responds with an array of comment objects correctly sorted by created_at (date) descending", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const comments = body.comments;
        expect(comments).toBeInstanceOf(Array);
        expect(comments).toHaveLength(11);

        for (let i = 0; i < comments.length - 1; i++) {
          expect(
            new Date(comments[i].created_at).getTime()
          ).toBeGreaterThanOrEqual(
            new Date(comments[i + 1].created_at).getTime()
          );
        }
      });
  });

  test("400 - responds with 'Bad Request' when the article_id requested is invalid", () => {
    return request(app)
      .get("/api/articles/invalid/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });

  test("404 - responds with 'Resource Not Found' when the article_id has no comments", () => {
    return request(app)
      .get("/api/articles/999999/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Resource Not Found");
      });
  });
});
