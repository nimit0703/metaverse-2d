const axios2 = require("axios");

const BACKEND_URL = "http://localhost:3000"
const WS_URL = "ws://localhost:3001"

const axios = {
  post: async (...args) => {
      try {
          const res = await axios2.post(...args)
          return res
      } catch(e) {
          return e.response
      }
  },
  get: async (...args) => {
      try {
          const res = await axios2.get(...args)
          return res
      } catch(e) {
          return e.response
      }
  },
  put: async (...args) => {
      try {
          const res = await axios2.put(...args)
          return res
      } catch(e) {
          return e.response
      }
  },
  delete: async (...args) => {
      try {
          const res = await axios2.delete(...args)
          return res
      } catch(e) {
          return e.response
      }
  },
}

describe("Authentication", () => {
  test("user be able to sign up only once", async () => {
    const username = "nimit" + Math.random();
    const password = "12345678";
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
    const password = "1234";
    const response = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      password,
      type: "admin",
    });
    expect(response.status).toBe(400);
  });

  test("signin succeeds if username and password are correct", async () => {
    const username = "nimit" + Math.random();
    const password = "123456789";
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
    const password = "1234";
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

// describe("User metadata endpoints", () => {
//   let token = "";
//   let avatarId = "";
//   beforeAll(async () => {
//     const username = "nimit" + Math.random();
//     const password = "123456789";
//     await axios.post(`${BACKEND_URL}/api/v1/signup`, {
//       username,
//       password,
//       type: "admin",
//     });
//     const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
//       username,
//       password,
//     });  
//     console.log("token sent", response.data);
      
//     token = response.data.token;

//     const avatarResponce = await axios.post(
//       `${BACKEND_URL}/api/v1/admin/avatar`,
//       {
//         imageUrl: "img",
//         name: "avatar1",
//       },
//       {
//         headers: { Authorization: `Bearer ${token}` },
//       }
//     );
//     avatarId = avatarResponce.data.avatarId;
//   });

//   test("User cann't update their matadata with wrong avatar id", async () => {
//     const response = await axios.post(
//       `${BACKEND_URL}/api/v1/user/metadata`,
//       {
//         avatarId: "1245786",
//       },
//       {
//         headers: { Authorization: `Bearer ${token}` },
//       }
//     );    
//     expect(response.status).toBe(400);
//   });

//   // test("User can update their matadat with right avatar id", async () => {
//   //   const response = await axios.put(
//   //     `${BACKEND_URL}/api/v1/user/metadata`,
//   //     {
//   //       avatarId,
//   //     },
//   //     {
//   //       headers: { Authorization: `Bearer ${token}` },
//   //     }
//   //   );
//   //   expect(response.status).toBe(200);
//   // });

//   // test("USer is not able to update their matadata if the auth header is not present", async () => {
//   //   const response = await axios.put(`${BACKEND_URL}/api/v1/user/metadata`, {
//   //     avatarId,
//   //   });
//   //   expect(response.status).toBe(403);
//   // });
// });

// describe("User avatar information", () => {
//   let token = "";
//   let avatarId = "";
//   let userId;
//   beforeAll(async () => {
//     const username = "nimit" + Math.random();
//     const password = "1234";
//     const signupResponce = axios.post(`${BACKEND_URL}/api/v1/signup`, {
//       username,
//       password,
//       type: "admin",
//     });
//     userId = (await signupResponce).data.userId;
//     const response = axios.post(`${BACKEND_URL}/api/v1/signin`, {
//       username,
//       password,
//     });
//     token = response.data.token;

//     const avatarResponce = await axios.post(
//       `${BACKEND_URL}/api/v1/admin/avatar`,
//       {
//         imageUrl: "img",
//         name: "avatar1",
//       },
//       {
//         headers: { Authorization: `Bearer ${token}` },
//       }
//     );
//     avatarId = avatarResponce.data.avatarId;
//   });

//   test("get back avatar information for a user", async () => {
//     const response = await axios.get(
//       `${BACKEND_URL}/api/v1/metadata/bulk?ids=[${avatarId}]`
//     );
//     expect(response.data.avatars.length).toBe(1);
//     expect(response.data.avatars[0].userId).toBe(userId);
//   });
//   test("avaiable avatar lists the recently created avatar", async () => {
//     const response = await axios.get(`${BACKEND_URL}/api/v1/avatars`);
//     expect(response.data.avatars.length).not.toBe(0);

//     const currentAvatar = response.data.avatars.find((x) => x.id == avatarId);
//     expect(currentAvatar).toBeDefined();
//   });
// });

// describe("space information", () => {
//   let mapId;
//   let element1Id, element2Id;
//   let adminToken;
//   let adminId;
//   let userId;
//   let userToken;
//   beforeAll(async () => {
//     const username = "nimit" + Math.random();
//     const password = "1234";
//     const signupResponce = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
//       username,
//       password,
//       type: "admin",
//     });
//     adminId = signupResponce.data.userId;
//     const response = axios.post(`${BACKEND_URL}/api/v1/signin`, {
//       username,
//       password,
//     });
//     adminToken = response.data.token;

//     const userSignupResponce = await axios.post(
//       `${BACKEND_URL}/api/v1/signup`,
//       {
//         username: username + "-user",
//         password,
//         type: "user",
//       }
//     );
//     userId = userSignupResponce.data.userId;
//     const userResponse = axios.post(`${BACKEND_URL}/api/v1/signin`, {
//       username: username + "-user",
//       password,
//     });
//     userToken = userResponse.data.token;

//     const element1 = await axios.post(
//       `${BACKEND_URL}/api/v1/admin/element`,
//       {
//         imageUrl: "img",
//         width: 1,
//         height: 1,
//         static: true,
//       },
//       {
//         headers: { Authorization: `Bearer ${adminToken}` },
//       }
//     );
//     const element2 = await axios.post(
//       `${BACKEND_URL}/api/v1/admin/element`,
//       {
//         imageUrl: "img",
//         width: 1,
//         height: 1,
//         static: true,
//       },
//       {
//         headers: { Authorization: `Bearer ${adminToken}` },
//       }
//     );
//     element1Id = element1.data.elementId;
//     element2Id = element2.data.elementId;

//     const map = await axios.post(
//       `${BACKEND_URL}/api/v1/admin/map`,
//       {
//         thumbnail: "img",
//         dimentions: "100x200",
//         defaultElements: [
//           {
//             elementId: element1Id,
//             x: 10,
//             y: 10,
//           },
//           {
//             elementId: element1Id,
//             x: 50,
//             y: 50,
//           },
//           {
//             elementId: element2Id,
//             x: 10,
//             y: 20,
//           },
//           {
//             elementId: element2Id,
//             x: 10,
//             y: 20,
//           },
//         ],
//       },
//       {
//         headers: { Authorization: `Bearer ${adminToken}` },
//       }
//     );
//     mapId = map.data.mapId;
//   });
//   test("User is able to create a space ", async () => {
//     const response = await axios.post(
//       `${BACKEND_URL}/api/v1/space`,
//       {
//         name: "test space",
//         dimentions: "100x200",
//         mapId,
//       },
//       {
//         headers: { Authorization: `Bearer ${userToken}` },
//       }
//     );
//     expect(response.data.spaceId).toBeDefined();
//   });
//   test("User is able to create a space without a mapId(empty space)", async () => {
//     const response = await axios.post(
//       `${BACKEND_URL}/api/v1/space`,
//       {
//         name: "test space",
//         dimentions: "100x200",
//       },
//       {
//         headers: { Authorization: `Bearer ${userToken}` },
//       }
//     );
//     expect(response.data.spaceId).toBeDefined();
//   });
//   test("User is able to create a space without a mapId(empty space) and dimentions", async () => {
//     const response = await axios.post(
//       `${BACKEND_URL}/api/v1/space`,
//       {
//         name: "test space",
//       },
//       {
//         headers: { Authorization: `Bearer ${userToken}` },
//       }
//     );
//     expect(response.status).toBe(400);
//   });
//   test("User is not able to delete a space that does not exists", async () => {
//     const response = await axios.delete(
//       `${BACKEND_URL}/api/v1/space/randomIddoesntExist`,
//       {
//         headers: { Authorization: `Bearer ${userToken}` },
//       }
//     );
//     expect(response.status).toBe(400);
//   });
//   test("User is able to delete a space that does exists", async () => {
//     const spaceResponse = await axios.post(
//       `${BACKEND_URL}/api/v1/space`,
//       {
//         name: "test space",
//         dimentions: "100x200",
//       },
//       {
//         headers: { Authorization: `Bearer ${userToken}` },
//       }
//     );
//     const response = await axios.delete(
//       `${BACKEND_URL}/api/v1/space/${spaceResponse.data.spaceId}}`,
//       {
//         headers: { Authorization: `Bearer ${userToken}` },
//       }
//     );
//     expect(response.status).toBe(200);
//   });

//   test("user should not able to delete space created by other user", async () => {
//     const spaceResponse = await axios.post(
//       `${BACKEND_URL}/api/v1/space`,
//       {
//         name: "test space",
//         dimentions: "100x200",
//       },
//       {
//         headers: { Authorization: `Bearer ${userToken}` },
//       }
//     );
//     const response = await axios.delete(
//       `${BACKEND_URL}/api/v1/space/${spaceResponse.data.spaceId}`,
//       {
//         headers: { Authorization: `Bearer ${adminToken}` },
//       }
//     );
//     expect(response.status).toBe(400);
//   });
//   test("admin has no space intiall...", async () => {
//     const response = await axios.get(`${BACKEND_URL}/api/v1/space/all`, {
//       headers: { Authorization: `Bearer ${adminToken}` },
//     });

//     expect(response.data.spaces.length).toBe(0);

//     const spaceResponse = await axios.post(
//       `${BACKEND_URL}/api/v1/space`,
//       {
//         name: "test space",
//         dimentions: "100x200",
//       },
//       {
//         headers: { Authorization: `Bearer ${adminToken}` },
//       }
//     );
//     const response2 = await axios.get(`${BACKEND_URL}/api/v1/space/all`, {
//       headers: { Authorization: `Bearer ${adminToken}` },
//     });
//     const filteredSpace = response2.data.spaces.find(
//       (x) => x.id == spaceResponse.spaceId
//     );
//     expect(response2.data.spaces.length).toBe(1);
//     expect(filteredSpace).toBeDefined();
//   });
// });

// describe("arena Information", () => {
//   let mapId;
//   let element1Id, element2Id;
//   let adminToken;
//   let adminId;
//   let userId;
//   let userToken;
//   let spaceID;
//   beforeAll(async () => {
//     const username = "nimit" + Math.random();
//     const password = "1234";
//     const signupResponce = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
//       username,
//       password,
//       type: "admin",
//     });
//     adminId = signupResponce.data.userId;
//     const response = axios.post(`${BACKEND_URL}/api/v1/signin`, {
//       username,
//       password,
//     });
//     adminToken = response.data.token;

//     const userSignupResponce = await axios.post(
//       `${BACKEND_URL}/api/v1/signup`,
//       {
//         username: username + "-user",
//         password,
//         type: "user",
//       }
//     );
//     userId = userSignupResponce.data.userId;
//     const userResponse = axios.post(`${BACKEND_URL}/api/v1/signin`, {
//       username: username + "-user",
//       password,
//     });
//     userToken = userResponse.data.token;

//     const element1 = await axios.post(
//       `${BACKEND_URL}/api/v1/admin/element`,
//       {
//         imageUrl: "img",
//         width: 1,
//         height: 1,
//         static: true,
//       },
//       {
//         headers: { Authorization: `Bearer ${adminToken}` },
//       }
//     );
//     const element2 = await axios.post(
//       `${BACKEND_URL}/api/v1/admin/element`,
//       {
//         imageUrl: "img",
//         width: 1,
//         height: 1,
//         static: true,
//       },
//       {
//         headers: { Authorization: `Bearer ${adminToken}` },
//       }
//     );
//     element1Id = element1.data.elementId;
//     element2Id = element2.data.elementId;

//     const map = await axios.post(
//       `${BACKEND_URL}/api/v1/admin/map`,
//       {
//         thumbnail: "img",
//         dimentions: "100x200",
//         defaultElements: [
//           {
//             elementId: element1Id,
//             x: 10,
//             y: 10,
//           },
//           {
//             elementId: element1Id,
//             x: 50,
//             y: 50,
//           },
//           {
//             elementId: element2Id,
//             x: 10,
//             y: 20,
//           },
//           {
//             elementId: element2Id,
//             x: 10,
//             y: 20,
//           },
//         ],
//       },
//       {
//         headers: { Authorization: `Bearer ${adminToken}` },
//       }
//     );
//     mapId = map.data.mapId;

//     const spaceResponse = await axios.post(
//       `${BACKEND_URL}/api/v1/space`,
//       {
//         name: "test space avatar",
//         dimentions: "100x200",
//         mapId,
//       },
//       {
//         headers: { Authorization: `Bearer ${userToken}` },
//       }
//     );
//     spaceID = spaceResponse.data.spaceId;
//   });
//   test("incorect space id return n ", async () => {
//     const incorrectSpace = await axios.get(
//       `${BACKEND_URL}/api/v1/space/randomIddoesntExist`,
//       {
//         headers: { Authorization: `Bearer ${userToken}` },
//       }
//     );
//     expect(incorrectSpace.status).toBe(400);

//     const space = await axios.get(`${BACKEND_URL}/api/v1/space/${spaceID}`, {
//       headers: { Authorization: `Bearer ${userToken}` },
//     });

//     expect(space.data.dimentions).toBe("100x200");
//   });
//   test("delete  endpoint is able to delete element", async () => {
//     const space = await axios.get(`${BACKEND_URL}/api/v1/space/${spaceID}`, {
//       headers: { Authorization: `Bearer ${userToken}` },
//     });

//     const response = await axios.delete(
//       `${BACKEND_URL}/api/v1/space/element/`,
//       {
//         spaceId: spaceID,
//         elementId: space.data.elements[0].id,
//       },
//       {
//         headers: { Authorization: `Bearer ${userToken}` },
//       }
//     );

//     const newSpaceRes = await axios.get(
//       `${BACKEND_URL}/api/v1/space/${spaceID}`,
//       {
//         headers: { Authorization: `Bearer ${userToken}` },
//       }
//     );
//     expect(newSpaceRes.data.elements.length).toBe(2);
//   });
//   test("adding a element  endpoint is able to delete element", async () => {
//     const response = await axios.post(
//       `${BACKEND_URL}/api/v1/space/element/`,
//       {
//         spaceId: spaceID,
//         elementId: element1Id,
//         x: 50,
//         y: 50,
//       },
//       {
//         headers: { Authorization: `Bearer ${userToken}` },
//       }
//     );

//     const newSpaceRes = await axios.get(
//       `${BACKEND_URL}/api/v1/space/${spaceID}`,
//       {
//         headers: { Authorization: `Bearer ${userToken}` },
//       }
//     );
//     expect(newSpaceRes.data.elements.length).toBe(3);
//   });
//   test("adding a element  fails if x and y are out of bound", async () => {
//     const response = await axios.post(
//       `${BACKEND_URL}/api/v1/space/element/`,
//       {
//         spaceId: spaceID,
//         elementId: element1Id,
//         x: 500,
//         y: 550,
//       },
//       {
//         headers: { Authorization: `Bearer ${userToken}` },
//       }
//     );
//     expect(response.status).toBe(400);
//   });
// });

// describe("admin endpoints", () => {
//   let mapId;
//   let element1Id, element2Id;
//   let adminToken;
//   let adminId;
//   let userId;
//   let userToken;
//   let spaceID;
//   beforeAll(async () => {
//     const username = "nimit" + Math.random();
//     const password = "1234";
//     const signupResponce = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
//       username,
//       password,
//       type: "admin",
//     });
//     adminId = signupResponce.data.userId;
//     const response = axios.post(`${BACKEND_URL}/api/v1/signin`, {
//       username,
//       password,
//     });
//     adminToken = response.data.token;

//     const userSignupResponce = await axios.post(
//       `${BACKEND_URL}/api/v1/signup`,
//       {
//         username: username + "-user",
//         password,
//         type: "user",
//       }
//     );
//     userId = userSignupResponce.data.userId;
//     const userResponse = axios.post(`${BACKEND_URL}/api/v1/signin`, {
//       username: username + "-user",
//       password,
//     });
//     userToken = userResponse.data.token;
//   });

//   test("user is not able to hit admin end points ", async () => {
//     const elementRes = await axios.post(
//       `${BACKEND_URL}/api/v1/admin/element`,
//       {
//         imageUrl: "img",
//         width: 1,
//         height: 1,
//         static: true,
//       },
//       {
//         headers: { Authorization: `Bearer ${userToken}` },
//       }
//     );
//     const mapRes = await axios.post(
//       `${BACKEND_URL}/api/v1/admin/map`,
//       {
//         thumbnail: "img",
//         dimentions: "100x200",
//         defaultElements: [],
//       },
//       {
//         headers: { Authorization: `Bearer ${userToken}` },
//       }
//     );
//     const avatarResponce = await axios.post(
//       `${BACKEND_URL}/api/v1/admin/avatar`,
//       {
//         imageUrl: "img",
//         name: "avatar1",
//       },
//       {
//         headers: { Authorization: `Bearer ${userToken}` },
//       }
//     );

//     const updteElementRes = await axios.put(
//       `${BACKEND_URL}/api/v1/admin/element/123`,
//       {
//         imageUrl: "img updated",
//       },
//       {
//         headers: { Authorization: `Bearer ${userToken}` },
//       }
//     );

//     expect(elementRes.status).toBe(403);
//     expect(mapRes.status).toBe(403);
//     expect(avatarResponce.status).toBe(403);
//     expect(updteElementRes.status).toBe(403);
//   });

//   test("admin is able to hit admin end points ", async () => {
//     const elementRes = await axios.post(
//       `${BACKEND_URL}/api/v1/admin/element`,
//       {
//         imageUrl: "img",
//         width: 1,
//         height: 1,
//         static: true,
//       },
//       {
//         headers: { Authorization: `Bearer ${adminToken}` },
//       }
//     );
//     const mapRes = await axios.post(
//       `${BACKEND_URL}/api/v1/admin/map`,
//       {
//         thumbnail: "img",
//         dimentions: "100x200",
//         defaultElements: [],
//       },
//       {
//         headers: { Authorization: `Bearer ${adminToken}` },
//       }
//     );
//     const avatarResponce = await axios.post(
//       `${BACKEND_URL}/api/v1/admin/avatar`,
//       {
//         imageUrl: "img",
//         name: "avatar1",
//       },
//       {
//         headers: { Authorization: `Bearer ${adminToken}` },
//       }
//     );

//     expect(elementRes.status).toBe(200);
//     expect(mapRes.status).toBe(200);
//     expect(avatarResponce.status).toBe(200);
//   });

//   test("admin is able to update the imgageUrl for an element", async () => {
//     const elementRes = await axios.post(
//       `${BACKEND_URL}/api/v1/admin/element`,
//       {
//         imageUrl: "img",
//         width: 1,
//         height: 1,
//         static: true,
//       },
//       {
//         headers: { Authorization: `Bearer ${adminToken}` },
//       }
//     );

//     const updteElementRes = await axios.put(
//       `${BACKEND_URL}/api/v1/admin/element/${elementRes.data.id}`,
//       {
//         imageUrl: "img updated",
//       },
//       {
//         headers: { Authorization: `Bearer ${userToken}` },
//       }
//     );

//     expect(updteElementRes.status).toBe(200);
//   });
// });

// describe("websocket tests", () => {
//   let userToken;
//   let userId;
//   let adminToken;
//   let adminId;
//   let mapId;
//   let element1Id;
//   let element2Id;
//   let spaceId;

//   let ws1;
//   let ws2;
//   let ws1Messages;
//   let ws2Messages;
//   let adminX, adminY;
//   let userX, userY;
//   async function setupHttp() {
//     username = `nimit-${Math.random()}`;
//     password = "1234";
//     const adminSignupResponse = await axios.post(
//       `${BACKEND_URL}/api/v1/signup`,
//       {
//         username,
//         password,
//         type: "admin",
//       }
//     );

//     const adminSignInResponse = await axios.post(
//       `${BACKEND_URL}/api/v1/signin`,
//       {
//         username,
//         password,
//       }
//     );
//     adminToken = adminSignInResponse.data.token;
//     adminId = adminSignInResponse.data.userId;

//     const userSignupResponse = await axios.post(
//       `${BACKEND_URL}/api/v1/signup`,
//       {
//         username: username + "-user",
//         password,
//         type: "user",
//       }
//     );

//     const userSignInResponse = await axios.post(
//       `${BACKEND_URL}/api/v1/signin`,
//       {
//         username: username + "-user",
//         password,
//       }
//     );
//     userToken = userSignInResponse.data.token;
//     userId = userSignInResponse.data.userId;

//     const element1 = await axios.post(
//       `${BACKEND_URL}/api/v1/admin/element`,
//       {
//         imageUrl: "img",
//         width: 1,
//         height: 1,
//         static: true,
//       },
//       {
//         headers: { Authorization: `Bearer ${adminToken}` },
//       }
//     );
//     const element2 = await axios.post(
//       `${BACKEND_URL}/api/v1/admin/element`,
//       {
//         imageUrl: "img",
//         width: 1,
//         height: 1,
//         static: true,
//       },
//       {
//         headers: { Authorization: `Bearer ${adminToken}` },
//       }
//     );
//     element1Id = element1.data.elementId;
//     element2Id = element2.data.elementId;

//     const map = await axios.post(
//       `${BACKEND_URL}/api/v1/admin/map`,
//       {
//         thumbnail: "img",
//         dimentions: "100x200",
//         defaultElements: [
//           {
//             elementId: element1Id,
//             x: 10,
//             y: 10,
//           },
//           {
//             elementId: element1Id,
//             x: 50,
//             y: 50,
//           },
//           {
//             elementId: element2Id,
//             x: 10,
//             y: 20,
//           },
//           {
//             elementId: element2Id,
//             x: 10,
//             y: 20,
//           },
//         ],
//       },
//       {
//         headers: { Authorization: `Bearer ${adminToken}` },
//       }
//     );
//     mapId = map.data.mapId;

//     const spaceResponse = await axios.post(
//       `${BACKEND_URL}/api/v1/space`,
//       {
//         name: "test space avatar",
//         dimentions: "100x200",
//         mapId,
//       },
//       {
//         headers: { Authorization: `Bearer ${userToken}` },
//       }
//     );
//     spaceId = spaceResponse.data.spaceId;
//   }

//   async function setupWs() {
//     ws1 = new WebSocket(WS_URL);
//     ws2 = new WebSocket(WS_URL);
//     await new Promise((resolve) => {
//       ws1.onopen = resolve;
//     });

//     ws1.onmessage = (event) => {
//       ws1Messages.push(JSON.parse(event.data));
//     };

//     await new Promise((resolve) => {
//       ws2.onopen = resolve;
//     });

//     ws2.onmessage = (event) => {
//       ws2Messages.push(JSON.parse(event.data));
//     };
//   }

//   function waitForandPopLatestMessages(messagesArray) {
//     return new Promise((resolve) => {
//       if (messagesArray.length > 0) {
//         resolve(messagesArray.shif());
//       } else {
//         const interval = setInterval(() => {
//           if (messagesArray.length > 0) {
//             clearInterval(interval);
//             resolve(messagesArray.shift());
//           }
//         }, 100);
//       }
//     });
//   }
//   beforeAll(async () => {
//     setupHttp();
//     setupWs();
//   });

//   test("get back Ack for joining space", async () => {
//     ws1.send(
//       JSON.stringify({
//         type: "join",
//         payload: {
//           spaceId,
//           token: adminToken,
//         },
//       })
//     );
//     ws2.send(
//       JSON.stringify({
//         type: "join",
//         payload: {
//           spaceId,
//           token: userToken,
//         },
//       })
//     );

//     const ack1 = await waitForandPopLatestMessages(ws1Messages);
//     const ack2 = await waitForandPopLatestMessages(ws2Messages);

//     expect(ack1.type).toBe("space-joined");
//     expect(ack2.type).toBe("space-joined");
//     expect(ack1.payload.users.length + ack2.payload.users.length).toBe(1);
//     adminX = ack1.payload.spawn.x;
//     adminY = ack1.payload.spawn.y;
//     userX = ack2.payload.spawn.x;
//     userY = ack2.payload.spawn.y;
//   });
//   test("USer should not be able to move across the boundry of wall", async () => {
//     ws1.send(
//       JSON.stringify({
//         type: "movement",
//         payload: {
//           x: 10000,
//           y: 100000,
//         },
//       })
//     );
//     const movementAck = await waitForandPopLatestMessages(ws1Messages);
//     expect(movementAck.type).toBe("movement-reject");
//     expect(movementAck.payload.x).toBe(adminX);
//     expect(movementAck.payload.y).toBe(adminY);
//   });
//   test("correct momvement should be broadcasted in the room", async () => {
//     ws1.send(
//       JSON.stringify({
//         type: "movement",
//         payload: {
//           x: adminX + 1,
//           y: adminY,
//           userId: adminId,
//         },
//       })
//     );
//     const movementAck = await waitForandPopLatestMessages(ws2Messages);
//     expect(movementAck.type).toBe("movement");
//     expect(movementAck.payload.x).toBe(adminX + 1);
//     expect(movementAck.payload.y).toBe(adminY);
//   });
//   test("if a user leave room other user receives a leave event", async () => {
//     ws1.close();
//     const movementAck = await waitForandPopLatestMessages(ws2Messages);
//     expect(movementAck.type).toBe("user-left");
//     expect(movementAck.payload.userId).toBe(adminId);
//   });
// });
