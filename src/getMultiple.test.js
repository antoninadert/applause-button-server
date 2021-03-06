console.error = console.log = jest.fn();

jest.setMock("./util/persistence", {
  getItems: urls => {
    return Promise.resolve(
      urls.map(url => ({
        url,
        claps: 10
      }))
    );
  }
});

const getMultiple = require("./getMultiple").fn;

test("returns the correct response", done => {
  const urls = JSON.stringify(["google.com", "microsoft.com"]);
  getMultiple({ body: urls }, undefined, (error, response) => {
    const body = JSON.parse(response.body);
    expect(body.length).toBe(2);
    done();
  });
});

test("removes duplicate URLs", done => {
  const urls = JSON.stringify(["google.com", "google.com", "microsoft.com"]);
  getMultiple({ body: urls }, undefined, (error, response) => {
    const body = JSON.parse(response.body);
    expect(body.length).toBe(2);
    done();
  });
});

test("normalises URLs", done => {
  const urls = JSON.stringify(["http://google.com", "microsoft.com"]);
  getMultiple({ body: urls }, undefined, (error, response) => {
    const body = JSON.parse(response.body);
    expect(body[0].url).toBe("google.com");
    expect(body[1].url).toBe("microsoft.com");
    done();
  });
});

test("validates that the request is an array", done => {
  getMultiple({ body: "fish" }, undefined, (error, response) => {
    expect(error).toBe("an error occurred - bad luck!");
    done();
  });
});

test("limits the request to 100 URLs", done => {
  const urls = [];
  for (var i = 0; i < 200; i++) {
    urls.push("google.com/" + i);
  }
  getMultiple({ body: JSON.stringify(urls) }, undefined, (error, response) => {
    const body = JSON.parse(response.body);
    expect(body.length).toBe(100);
    done();
  });
});
