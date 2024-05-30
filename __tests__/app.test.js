const db = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed.js");
const request = require("supertest");
const app = require("../app");
const fs = require("fs/promises");
require("jest-sorted");

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

  test('404 - responds with "Resource Not Found" when requesting an invalid endpoint resource', () => {
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

  test('404 - responds with "Resource Not Found" when requesting an invalid endpoint resource', () => {
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
        expect(articles).toBeSorted({ key: "created_at", descending: true });
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

  test("200 - responds with an array of comment objects correctly sorted by created_at (date) descending", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const comments = body.comments;
        expect(comments).toHaveLength(11);
        expect(comments).toBeSorted({ key: "created_at", descending: true });
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

  test("404 - responds with 'Resource Not Found' when the article_id entered does not exist", () => {
    return request(app)
      .get("/api/articles/999999/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Resource Not Found");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("201 - responds with the posted comment", () => {
    const newComment = {
      username: "butter_bridge",
      body: "I never tire of learning about mitch",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        const { comment } = body;
        expect(comment).toEqual(
          expect.objectContaining({
            comment_id: expect.any(Number),
            body: "I never tire of learning about mitch",
            votes: 0,
            author: "butter_bridge",
            article_id: 1,
            created_at: expect.any(String),
          })
        );
      });
  });

  test("400 - responds with 'Bad Request' when required fields are not entered", () => {
    const newComment = {};
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });

  test("400 - responds with 'Bad Request' when the article_id entered is invalid", () => {
    const newComment = {
      username: "butter_bridge",
      body: "I never tire of learning about mitch",
    };
    return request(app)
      .post("/api/articles/invalid/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });

  test("404 - responds with 'Resource Not Found' when the article_id entered does not exist", () => {
    const newComment = {
      username: "butter_bridge",
      body: "I never tire of learning about mitch",
    };
    return request(app)
      .post("/api/articles/999999/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Resource Not Found");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("200 - responds with the updated article", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: 1 })
      .expect(200)
      .then(({ body }) => {
        expect(body).toHaveProperty("article_id", 1);
        expect(body).toHaveProperty("votes", expect.any(Number));
      });
  });

  test("200 - confirms that the number of votes on the article before the patch have been updated by the correct amount after the patch", async () => {
    const responseBeforePatch = await request(app)
      .get("/api/articles/1")
      .expect(200);
    const votesBeforePatch = responseBeforePatch.body.article.votes;

    const VotesToIncrementBy = { inc_votes: 23 };
    const sendPatch = await request(app)
      .patch("/api/articles/1")
      .send(VotesToIncrementBy)
      .expect(200);

    const responseAfterPatch = await request(app)
      .get("/api/articles/1")
      .expect(200);
    const votesAfterPatch = responseAfterPatch.body.article.votes;

    expect(votesAfterPatch).toBe(
      votesBeforePatch + VotesToIncrementBy.inc_votes
    );
  });

  test('400 - responds with "Bad Request" when inc_votes is not a number', () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: "invalid" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });

  test('400 - responds with "Bad Request" when the article_id entered is invalid', () => {
    return request(app)
      .patch("/api/articles/invalid")
      .send({ inc_votes: 1 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });

  test('404 - responds with "Resource Not Found" when the article_id entered does not exist', () => {
    return request(app)
      .patch("/api/articles/999999")
      .send({ inc_votes: 1 })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Resource Not Found");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test('204 - deletes the comment with the requested comment_id and confirms that a get request for the deleted comment_id returns "Resource Not Found"', () => {
    return request(app)
      .delete("/api/comments/1")
      .expect(204)
      .then(() => {
        return request(app)
        .get("/api/comments/1")
        .expect(404);
      })
      .then(({ body }) => {
        expect(body.msg).toBe("Resource Not Found");
      });
  });

  test('400 - responds with "Bad Request" when the comment_id entered is invalid', () => {
    return request(app)
      .delete("/api/comments/invalid")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });

  test('404 - responds with "Resource not found" when the comment_id entered does not exist', () => {
    return request(app)
      .delete("/api/comments/9999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Resource Not Found");
      });
  });
});

describe("GET /api/users", () => {
    test("200 - responds with an array of user objects", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body }) => {
          const { users } = body;
          expect(users).toHaveLength(4);
          users.forEach((user) => {
            expect(user).toMatchObject({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            });
          });
        });
    });
  
    test('404 - responds with "Resource Not Found" when requesting an invalid endpoint resource', () => {
      return request(app)
        .get("/api/invalid-endpoint")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Resource Not Found");
        });
    });
  });