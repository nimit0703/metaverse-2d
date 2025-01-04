const axios2 = require("axios");

const BACKEND_URL = "http://localhost:3000";
const WS_URL = "ws://localhost:3001";

const axios = {
  post: async (...args) => {
    try {
      const res = await axios2.post(...args);
      return res;
    } catch (e) {
      return e.response;
    }
  },
  get: async (...args) => {
    try {
      const res = await axios2.get(...args);
      return res;
    } catch (e) {
      return e.response;
    }
  },
  put: async (...args) => {
    try {
      const res = await axios2.put(...args);
      return res;
    } catch (e) {
      return e.response;
    }
  },
  delete: async (...args) => {
    try {
      const res = await axios2.delete(...args);
      return res;
    } catch (e) {
      return e.response;
    }
  },
};

describe.skip("Authentication", () => {
  test("user be able to sign up only once", async () => {
    const username = "nimit" + Math.random();
    const password = "012345678678";
    const response = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
      type: "admin",
    });
    expect(response.status).toBe(200);

    const updatedResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
      type: "admin",
    });

    expect(updatedResponse.status).toBe(400);
  });

  test("signup request fails is username is empty", async () => {
    const password = "0123456789";
    const response = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      password,
      type: "admin",
    });
    expect(response.status).toBe(400);
  });

  test("signin succeeds if username and password are correct", async () => {
    const username = "nimit" + Math.random();
    const password = "0123456786789";
    await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
      type: "admin",
    });

    const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
      username,
      password,
    });
    expect(response.status).toBe(200);
    expect(response.data.token).toBeDefined();
  });

  test("signin fails if username and password are incorrect", async () => {
    const username = "nimit" + Math.random();
    const password = "0123456789";
    await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
      type: "admin",
    });
    const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
      username: "wrong_username",
      password: "wrong_password",
    });
    expect(response.status).toBe(403);
  });
});

describe.skip("User metadata endpoints", () => {
  let token = "";
  let avatarId = "";
  beforeAll(async () => {
    const username = "nimit" + Math.random();
    const password = "0123456786789";
    await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
      type: "admin",
    });
    const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
      username,
      password,
    });
    token = response.data.token;

    const avatarResponce = await axios.post(
      `${BACKEND_URL}/api/v1/admin/avatar`,
      {
        imageUrl:
          "imghttps://img.freepik.com/premium-vector/3d-avatar-person-wearing-vr-headset-style-rendered-cinema-4d-vector_969863-311820.jpg?w=740",
        name: "avatar1",
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    avatarId = avatarResponce.data.avatarId;
  });

  test("User cann't update their matadata with wrong avatar id", async () => {
    const response = await axios.post(
      `${BACKEND_URL}/api/v1/user/metadata`,
      {
        avatarId: "1245786",
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    expect(response.status).toBe(400);
  });

  test("User can update their matadat with right avatar id", async () => {
    const response = await axios.post(
      `${BACKEND_URL}/api/v1/user/metadata`,
      {
        avatarId,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    expect(response.status).toBe(200);
  });

  test("User is not able to update their matadata if the auth header is not present", async () => {
    const response = await axios.post(`${BACKEND_URL}/api/v1/user/metadata`, {
      avatarId,
    });
    expect(response.status).toBe(403);
  });
});

describe.skip("User avatar information", () => {
  let token = "";
  let avatarId = "";
  let userId;
  beforeAll(async () => {
    const username = "nimit" + Math.random();
    const password = "123456789";
    const signupResponce = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
      type: "admin",
    });
    userId = signupResponce.data.userId;
    const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
      username,
      password,
    });

    token = response.data.token;

    const avatarResponce = await axios.post(
      `${BACKEND_URL}/api/v1/admin/avatar`,
      {
        imageUrl:
          "imghttps://img.freepik.com/premium-vector/3d-avatar-person-wearing-vr-headset-style-rendered-cinema-4d-vector_969863-311820.jpg?w=740",
        name: "avatar1",
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    avatarId = avatarResponce.data.avatarId;
  });

  test("get back avatar information for a user", async () => {
    const response = await axios.get(
      `${BACKEND_URL}/api/v1/user/metadata/bulk?ids=[${userId}]`
    );
    expect(response.data.avatars.length).toBe(1);
    expect(response.data.avatars[0].userId).toBe(userId);
  });
  test("avaiable avatar lists the recently created avatar", async () => {
    const response = await axios.get(`${BACKEND_URL}/api/v1/avatars`);
    expect(response.data.avatars.length).not.toBe(0);

    const currentAvatar = response.data.avatars.find((x) => x.id == avatarId);
    expect(currentAvatar).toBeDefined();
  });
});

describe.skip("space information", () => {
  let mapId;
  let element1Id, element2Id;
  let adminToken;
  let adminId;
  let userId;
  let userToken;
  beforeAll(async () => {
    const username = "nimit" + Math.random();
    const password = "0123456789";
    const signupResponce = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
      type: "admin",
    });
    adminId = signupResponce.data.userId;
    const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
      username,
      password,
    });
    adminToken = response.data.token;

    const userSignupResponce = await axios.post(
      `${BACKEND_URL}/api/v1/signup`,
      {
        username: username + "-user",
        password,
        type: "user",
      }
    );
    userId = userSignupResponce.data.userId;
    const userResponse = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
      username: username + "-user",
      password,
    });
    userToken = userResponse.data.token;

    const element1 = await axios.post(
      `${BACKEND_URL}/api/v1/admin/element`,
      {
        imageUrl: "img",
        width: 1,
        height: 1,
        static: true,
      },
      {
        headers: { Authorization: `Bearer ${adminToken}` },
      }
    );
    const element2 = await axios.post(
      `${BACKEND_URL}/api/v1/admin/element`,
      {
        imageUrl: "img",
        width: 1,
        height: 1,
        static: true,
      },
      {
        headers: { Authorization: `Bearer ${adminToken}` },
      }
    );
    element1Id = element1.data.id;
    element2Id = element2.data.id;

    const map = await axios.post(
      `${BACKEND_URL}/api/v1/admin/map`,
      {
        thumbnail: "img",
        dimensions: "100x200",
        name: "map1",
        defaultElements: [
          {
            elementId: element1Id,
            x: 10,
            y: 10,
          },
          {
            elementId: element1Id,
            x: 50,
            y: 50,
          },
          {
            elementId: element2Id,
            x: 10,
            y: 20,
          },
          {
            elementId: element2Id,
            x: 10,
            y: 20,
          },
        ],
      },
      {
        headers: { Authorization: `Bearer ${adminToken}` },
      }
    );
    mapId = map.data.id;
  });
  test("User is able to create a space ", async () => {
    const response = await axios.post(
      `${BACKEND_URL}/api/v1/space`,
      {
        name: "test space",
        dimensions: "100x200",
        mapId,
      },
      {
        headers: { Authorization: `Bearer ${userToken}` },
      }
    );
    expect(response.data.spaceId).toBeDefined();
  });
  test("User is able to create a space without a mapId(empty space)", async () => {
    const response = await axios.post(
      `${BACKEND_URL}/api/v1/space`,
      {
        name: "test space",
        dimensions: "100x200",
      },
      {
        headers: { Authorization: `Bearer ${userToken}` },
      }
    );
    expect(response.data.spaceId).toBeDefined();
  });
  test("User is not able to create a space without a mapId(empty space) and dimensions", async () => {
    const response = await axios.post(
      `${BACKEND_URL}/api/v1/space`,
      {
        name: "test space",
      },
      {
        headers: { Authorization: `Bearer ${userToken}` },
      }
    );
    expect(response.status).toBe(400);
  });
  test("User is not able to delete a space that does not exists", async () => {
    const response = await axios.delete(
      `${BACKEND_URL}/api/v1/space/randomIddoesntExist`,
      {
        headers: { Authorization: `Bearer ${userToken}` },
      }
    );
    expect(response.status).toBe(400);
  });
  test("User is able to delete a space that does exists", async () => {
    const spaceResponse = await axios.post(
      `${BACKEND_URL}/api/v1/space`,
      {
        name: "test space",
        dimensions: "100x200",
      },
      {
        headers: { Authorization: `Bearer ${userToken}` },
      }
    );
    const response = await axios.delete(
      `${BACKEND_URL}/api/v1/space/${spaceResponse.data.spaceId}`,
      {
        headers: { Authorization: `Bearer ${userToken}` },
      }
    );
    expect(response.status).toBe(200);
  });

  test("user should not able to delete space created by other user", async () => {
    const spaceResponse = await axios.post(
      `${BACKEND_URL}/api/v1/space`,
      {
        name: "test space",
        dimensions: "100x200",
      },
      {
        headers: { Authorization: `Bearer ${userToken}` },
      }
    );
    const response = await axios.delete(
      `${BACKEND_URL}/api/v1/space/${spaceResponse.data.spaceId}`,
      {
        headers: { Authorization: `Bearer ${adminToken}` },
      }
    );
    expect(response.status).toBe(403);
  });
  test("admin has no space intially...", async () => {
    const response = await axios.get(`${BACKEND_URL}/api/v1/space/all`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });

    expect(response.data.spaces.length).toBe(0);

    const spaceResponse = await axios.post(
      `${BACKEND_URL}/api/v1/space`,
      {
        name: "test space",
        dimensions: "100x200",
      },
      {
        headers: { Authorization: `Bearer ${adminToken}` },
      }
    );
    const response2 = await axios.get(`${BACKEND_URL}/api/v1/space/all`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const filteredSpace = response2.data.spaces.find(
      (x) => x.id == spaceResponse.data.spaceId
    );
    expect(response2.data.spaces.length).toBe(1);
    expect(filteredSpace).toBeDefined();
  });
});

describe.skip("arena Information", () => {
  let mapId;
  let element1Id, element2Id;
  let adminToken;
  let adminId;
  let userId;
  let userToken;
  let spaceID;
  beforeAll(async () => {
    const username = "nimit" + Math.random();
    const password = "0123456789";
    const signupResponce = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
      type: "admin",
    });
    adminId = signupResponce.data.userId;
    const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
      username,
      password,
    });
    adminToken = response.data.token;

    const userSignupResponce = await axios.post(
      `${BACKEND_URL}/api/v1/signup`,
      {
        username: username + "-user",
        password,
        type: "user",
      }
    );
    userId = userSignupResponce.data.userId;
    const userResponse = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
      username: username + "-user",
      password,
    });
    userToken = userResponse.data.token;

    const element1 = await axios.post(
      `${BACKEND_URL}/api/v1/admin/element`,
      {
        imageUrl: "img",
        width: 1,
        height: 1,
        static: true,
      },
      {
        headers: { Authorization: `Bearer ${adminToken}` },
      }
    );
    const element2 = await axios.post(
      `${BACKEND_URL}/api/v1/admin/element`,
      {
        imageUrl: "img",
        width: 1,
        height: 1,
        static: true,
      },
      {
        headers: { Authorization: `Bearer ${adminToken}` },
      }
    );
    element1Id = element1.data.id;
    element2Id = element2.data.id;

    const map = await axios.post(
      `${BACKEND_URL}/api/v1/admin/map`,
      {
        thumbnail: "img",
        name: "map2",
        dimensions: "100x200",
        defaultElements: [
          {
            elementId: element1Id,
            x: 10,
            y: 10,
          },
          {
            elementId: element1Id,
            x: 50,
            y: 50,
          },
          {
            elementId: element2Id,
            x: 10,
            y: 20,
          },
          {
            elementId: element2Id,
            x: 10,
            y: 20,
          },
        ],
      },
      {
        headers: { Authorization: `Bearer ${adminToken}` },
      }
    );

    mapId = map.data.id;

    const spaceResponse = await axios.post(
      `${BACKEND_URL}/api/v1/space`,
      {
        name: "test space avatar",
        dimensions: "100x200",
        mapId,
      },
      {
        headers: { Authorization: `Bearer ${userToken}` },
      }
    );

    spaceID = spaceResponse.data.spaceId;
  });
  test("incorect space id return n ", async () => {
    const incorrectSpace = await axios.get(
      `${BACKEND_URL}/api/v1/space/randomIddoesntExist`,
      {
        headers: { Authorization: `Bearer ${userToken}` },
      }
    );
    expect(incorrectSpace.status).toBe(400);

    const space = await axios.get(`${BACKEND_URL}/api/v1/space/${spaceID}`, {
      headers: { Authorization: `Bearer ${userToken}` },
    });

    expect(space.data.dimensions).toBe("100x200");
  });
  test("delete  endpoint is able to delete element", async () => {
    const space = await axios.get(`${BACKEND_URL}/api/v1/space/${spaceID}`, {
      headers: { Authorization: `Bearer ${userToken}` },
    });
    const beforeElementsLength = space.data.elements.length;

    let response = await axios.delete(`${BACKEND_URL}/api/v1/space/element`, {
      data: { id: space.data.elements[0].id },
      headers: {
        authorization: `Bearer ${userToken}`,
      },
    });

    const newSpaceRes = await axios.get(
      `${BACKEND_URL}/api/v1/space/${spaceID}`,
      {
        headers: { Authorization: `Bearer ${userToken}` },
      }
    );
    expect(newSpaceRes.data.elements.length).toBe(beforeElementsLength - 1);
  });
  test("adding a element  endpoint is able to delete element", async () => {
    // const beforeElementsLength = space.data.elements.length
    const response = await axios.post(
      `${BACKEND_URL}/api/v1/space/element/`,
      {
        spaceId: spaceID,
        elementId: element1Id,
        x: 50,
        y: 50,
      },
      {
        headers: { Authorization: `Bearer ${userToken}` },
      }
    );

    const newSpaceRes = await axios.get(
      `${BACKEND_URL}/api/v1/space/${spaceID}`,
      {
        headers: { Authorization: `Bearer ${userToken}` },
      }
    );
    expect(newSpaceRes.data.elements.length).toBe(4);
  });
  test("adding a element  fails if x and y are out of bound", async () => {
    const response = await axios.post(
      `${BACKEND_URL}/api/v1/space/element/`,
      {
        spaceId: spaceID,
        elementId: element1Id,
        x: 500,
        y: 550,
      },
      {
        headers: { Authorization: `Bearer ${userToken}` },
      }
    );
    expect(response.status).toBe(400);
  });
});

describe.skip("admin endpoints", () => {
  let mapId;
  let element1Id, element2Id;
  let adminToken;
  let adminId;
  let userId;
  let userToken;
  let spaceID;
  beforeAll(async () => {
    const username = "nimit" + Math.random();
    const password = "0123456789";
    const signupResponce = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
      type: "admin",
    });
    adminId = signupResponce.data.userId;
    const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
      username,
      password,
    });
    adminToken = response.data.token;

    const userSignupResponce = await axios.post(
      `${BACKEND_URL}/api/v1/signup`,
      {
        username: username + "-user",
        password,
        type: "user",
      }
    );
    userId = userSignupResponce.data.userId;
    const userResponse = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
      username: username + "-user",
      password,
    });
    userToken = userResponse.data.token;
  });

  test("user is not able to hit admin end points ", async () => {
    const elementRes = await axios.post(
      `${BACKEND_URL}/api/v1/admin/element`,
      {
        imageUrl: "img",
        width: 1,
        height: 1,
        static: true,
      },
      {
        headers: { Authorization: `Bearer ${userToken}` },
      }
    );
    const mapRes = await axios.post(
      `${BACKEND_URL}/api/v1/admin/map`,
      {
        thumbnail: "img",
        dimensions: "100x200",
        defaultElements: [],
      },
      {
        headers: { Authorization: `Bearer ${userToken}` },
      }
    );
    const avatarResponce = await axios.post(
      `${BACKEND_URL}/api/v1/admin/avatar`,
      {
        imageUrl: "img",
        name: "avatar1",
      },
      {
        headers: { Authorization: `Bearer ${userToken}` },
      }
    );

    const updteElementRes = await axios.put(
      `${BACKEND_URL}/api/v1/admin/element/123`,
      {
        imageUrl: "img updated",
      },
      {
        headers: { Authorization: `Bearer ${userToken}` },
      }
    );

    expect(elementRes.status).toBe(403);
    expect(mapRes.status).toBe(403);
    expect(avatarResponce.status).toBe(403);
    expect(updteElementRes.status).toBe(403);
  });

  test("admin is able to hit admin end points ", async () => {
    const elementRes = await axios.post(
      `${BACKEND_URL}/api/v1/admin/element`,
      {
        imageUrl: "img",
        width: 1,
        height: 1,
        static: true,
      },
      {
        headers: { Authorization: `Bearer ${adminToken}` },
      }
    );
    const mapRes = await axios.post(
      `${BACKEND_URL}/api/v1/admin/map`,
      {
        name: "map3",
        thumbnail: "img",
        dimensions: "100x200",
        defaultElements: [],
      },
      {
        headers: { Authorization: `Bearer ${adminToken}` },
      }
    );
    const avatarResponce = await axios.post(
      `${BACKEND_URL}/api/v1/admin/avatar`,
      {
        imageUrl: "img",
        name: "avatar1",
      },
      {
        headers: { Authorization: `Bearer ${adminToken}` },
      }
    );

    expect(elementRes.status).toBe(200);
    expect(mapRes.status).toBe(200);
    expect(avatarResponce.status).toBe(200);
  });

  test("admin is able to update the imgageUrl for an element", async () => {
    const elementRes = await axios.post(
      `${BACKEND_URL}/api/v1/admin/element`,
      {
        imageUrl: "img",
        width: 1,
        height: 1,
        static: true,
      },
      {
        headers: { Authorization: `Bearer ${adminToken}` },
      }
    );

    const updteElementRes = await axios.put(
      `${BACKEND_URL}/api/v1/admin/element/${elementRes.data.id}`,
      {
        imageUrl: "img updated",
      },
      {
        headers: { Authorization: `Bearer ${adminToken}` },
      }
    );

    expect(updteElementRes.status).toBe(200);
  });
});

describe("Websocket tests", () => {
  let adminToken;
  let adminUserId;
  let userToken;
  let adminId;
  let userId;
  let mapId;
  let element1Id;
  let element2Id;
  let spaceId;
  let ws1;
  let ws2;
  let ws1Messages = [];
  let ws2Messages = [];
  let userX;
  let userY;
  let adminX;
  let adminY;

  function waitForAndPopLatestMessage(messageArray) {
    return new Promise((resolve) => {
      if (messageArray.length > 0) {
        resolve(messageArray.shift());
      } else {
        let interval = setInterval(() => {
          if (messageArray.length > 0) {
            resolve(messageArray.shift());
            clearInterval(interval);
          }
        }, 100);
      }
    });
  }

  async function setupHTTP() {
    const username = `nimit-${Math.random()}`;
    const password = "123456789";
    const adminSignupResponse = await axios.post(
      `${BACKEND_URL}/api/v1/signup`,
      {
        username,
        password,
        type: "admin",
      }
    );

    const adminSigninResponse = await axios.post(
      `${BACKEND_URL}/api/v1/signin`,
      {
        username,
        password,
      }
    );

    adminUserId = adminSignupResponse.data.userId;
    adminToken = adminSigninResponse.data.token;
    console.log("adminSignupResponse.status");
    console.log(adminSignupResponse.status);

    const userSignupResponse = await axios.post(
      `${BACKEND_URL}/api/v1/signup`,
      {
        username: username + `-user`,
        password,
        type: "user",
      }
    );
    const userSigninResponse = await axios.post(
      `${BACKEND_URL}/api/v1/signin`,
      {
        username: username + `-user`,
        password,
      }
    );
    userId = userSignupResponse.data.userId;
    userToken = userSigninResponse.data.token;
    console.log("useroktne", userToken);
    const element1Response = await axios.post(
      `${BACKEND_URL}/api/v1/admin/element`,
      {
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
        width: 1,
        height: 1,
        static: true,
      },
      {
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
      }
    );

    const element2Response = await axios.post(
      `${BACKEND_URL}/api/v1/admin/element`,
      {
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
        width: 1,
        height: 1,
        static: true,
      },
      {
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
      }
    );
    element1Id = element1Response.data.id;
    element2Id = element2Response.data.id;

    const mapResponse = await axios.post(
      `${BACKEND_URL}/api/v1/admin/map`,
      {
        thumbnail: "https://thumbnail.com/a.png",
        dimensions: "100x200",
        name: "Defaul space",
        defaultElements: [
          {
            elementId: element1Id,
            x: 20,
            y: 20,
          },
          {
            elementId: element1Id,
            x: 18,
            y: 20,
          },
          {
            elementId: element2Id,
            x: 19,
            y: 20,
          },
        ],
      },
      {
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
      }
    );
    mapId = mapResponse.data.id;

    const spaceResponse = await axios.post(
      `${BACKEND_URL}/api/v1/space`,
      {
        name: "Test",
        dimensions: "100x200",
        mapId: mapId,
      },
      {
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      }
    );

    console.log(spaceResponse.status);
    spaceId = spaceResponse.data.spaceId;
  }
  async function setupWs() {
    ws1 = new WebSocket(WS_URL);

    ws1.onmessage = (event) => {
      console.log("got back adata 1");
      console.log(event.data);

      ws1Messages.push(JSON.parse(event.data));
    };
    await new Promise((r) => {
      ws1.onopen = r;
    });

    ws2 = new WebSocket(WS_URL);

    ws2.onmessage = (event) => {
      console.log("got back data 2");
      console.log(event.data);
      ws2Messages.push(JSON.parse(event.data));
    };
    await new Promise((r) => {
      ws2.onopen = r;
    });
  }

  beforeAll(async () => {
    await setupHTTP();
    await setupWs();
  });

  test("Get back ack for joining the space", async () => {
    console.log("insixce first test");
    ws1.send(
      JSON.stringify({
        type: "join",
        payload: {
          spaceId: spaceId,
          token: adminToken,
        },
      })
    );
    console.log("insixce first test1");
    const message1 = await waitForAndPopLatestMessage(ws1Messages);
    console.log("insixce first test2");
    ws2.send(
      JSON.stringify({
        type: "join",
        payload: {
          spaceId: spaceId,
          token: userToken,
        },
      })
    );
    console.log("insixce first test3");

    const message2 = await waitForAndPopLatestMessage(ws2Messages);
    const message3 = await waitForAndPopLatestMessage(ws1Messages);

    expect(message1.type).toBe("space-joined");
    expect(message2.type).toBe("space-joined");
    expect(message1.payload.users.length).toBe(0);
    expect(message2.payload.users.length).toBe(1);
    expect(message3.type).toBe("user-joined");
    expect(message3.payload.x).toBe(message2.payload.spawn.x);
    expect(message3.payload.y).toBe(message2.payload.spawn.y);
    expect(message3.payload.userId).toBe(userId);

    adminX = message1.payload.spawn.x;
    adminY = message1.payload.spawn.y;

    userX = message2.payload.spawn.x;
    userY = message2.payload.spawn.y;
  });

  test.skip("User should not be able to move across the boundary of the wall", async () => {
    ws1.send(
      JSON.stringify({
        type: "move",
        payload: {
          x: 1000000,
          y: 10000,
        },
      })
    );

    const message = await waitForAndPopLatestMessage(ws1Messages);
    expect(message.type).toBe("movement-rejected");
    expect(message.payload.x).toBe(adminX);
    expect(message.payload.y).toBe(adminY);
  });

  test.skip("User should not be able to move two blocks at the same time", async () => {
    ws1.send(
      JSON.stringify({
        type: "move",
        payload: {
          x: adminX + 2,
          y: adminY,
        },
      })
    );

    const message = await waitForAndPopLatestMessage(ws1Messages);
    expect(message.type).toBe("movement-rejected");
    expect(message.payload.x).toBe(adminX);
    expect(message.payload.y).toBe(adminY);
  });

  test.skip("Correct movement should be broadcasted to the other sockets in the room", async () => {
    ws1.send(
      JSON.stringify({
        type: "move",
        payload: {
          x: adminX + 1,
          y: adminY,
          userId: adminId,
        },
      })
    );

    const message = await waitForAndPopLatestMessage(ws2Messages);
    expect(message.type).toBe("movement");
    expect(message.payload.x).toBe(adminX + 1);
    expect(message.payload.y).toBe(adminY);
  });

  test.skip("If a user leaves, the other user receives a leave event", async () => {
    ws1.close();
    const message = await waitForAndPopLatestMessage(ws2Messages);
    expect(message.type).toBe("user-left");
    expect(message.payload.userId).toBe(adminUserId);
  });
});
