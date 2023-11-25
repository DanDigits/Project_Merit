import {
  modifyUser,
  signUp,
  verifyUser,
  deleteUser,
  getUser,
  passwordLock,
  suspendUser,
  getGroup,
  getGroupOrphans,
  getAllUsers,
  deleteGroup,
  renameGroup,
  getSupervisor,
  getGroups,
  removeMultipleUsers,
} from "server/mongodb/actions/User";

import nodemailer from "nodemailer";
import {
  resendMail,
  GET,
  POST,
  PATCH,
  DELETE,
} from "server/mongodb/actions/User";

/*// Mocking the modules
jest.mock('server/mongodb/actions/User', () => ({
  modifyUser: jest.fn(),
  signUp: jest.fn(),
  verifyUser: jest.fn(),
  // ...and so on for other functions
}));

jest.mock('nodemailer', () => ({
  createTransport: jest.fn(() => ({
    sendMail: jest.fn(),
  })),
}));
*/

jest.mock("../dbConnection"); // Mock the MongoDB connection

describe("GET function tests", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should handle case 1: Send email if user forgot password", async () => {
    // Set up test data and mocks
    const mockForgot = "mockedForgot";
    const mockedRes = {
      email: "test@example.com",
      emailVerification: "123456",
    };
    getUser.mockResolvedValue(mockedRes);
    resendMail.mockResolvedValue("Email sent");

    // Call the GET function with request case 1
    const mockRequest = {
      headers: () => ({
        get: jest.fn().mockReturnValue(mockForgot),
      }),
      url: "mocked_url?num=123", // Mocking the URL with 'num' parameter
    };
    const response = await GET(mockRequest);

    // Assert the function calls and response
    expect(getUser).toHaveBeenCalledWith(mockForgot);
    expect(resendMail).toHaveBeenCalledWith(mockedRes.email, "forgotPassword");
    expect(response.status).toBe(200);
  });

  it("should handle case 2: Return existing user information", async () => {
    // Set up test data and mocks
    const mockUser = "mockedUser";
    const mockedRes = { email: "test@example.com" };
    getUser.mockResolvedValue(mockedRes);

    // Call the GET function with request case 2
    const mockRequest = {
      headers: () => ({
        get: jest.fn().mockReturnValue(mockUser),
      }),
      url: "mocked_url", // Mocking the URL without 'num' parameter
    };
    const response = await GET(mockRequest);

    // Assert the function calls and response
    expect(getUser).toHaveBeenCalledWith(mockUser);
    expect(response.status).toBe(200);
  });

  it("should handle case 3: Resend respective emails", async () => {
    // Set up test data and mocks
    const mockForgot = "mockedForgot";
    const mockUser = "mockedUser";
    const mockedRes = "Email sent";

    // Mocking different scenarios for resendMail function
    resendMail.mockResolvedValue(mockedRes);

    // Case: forgot parameter defined, user parameter undefined
    let mockRequest = {
      headers: () => ({
        get: jest
          .fn()
          .mockReturnValueOnce(mockForgot)
          .mockReturnValueOnce(undefined),
      }),
      url: "mocked_url", // Mocking the URL without 'num' parameter
    };
    let response = await GET(mockRequest);
    expect(resendMail).toHaveBeenCalledWith(mockForgot, "forgotPassword");
    expect(response.status).toBe(200);

    // Case: user parameter defined, forgot parameter undefined
    mockRequest = {
      headers: () => ({
        get: jest
          .fn()
          .mockReturnValueOnce(undefined)
          .mockReturnValueOnce(mockUser),
      }),
      url: "mocked_url", // Mocking the URL without 'num' parameter
    };
    response = await GET(mockRequest);
    expect(resendMail).toHaveBeenCalledWith(mockUser, "signup");
    expect(response.status).toBe(200);

    // Case: both user and forgot parameters are undefined
    mockRequest = {
      headers: () => ({
        get: jest.fn().mockReturnValue(undefined),
      }),
      url: "mocked_url", // Mocking the URL without 'num' parameter
    };
    response = await GET(mockRequest);
    expect(response.status).toBe(400);
  });

  it("should handle case 4: Get given group members/users", async () => {
    // Set up test data and mocks
    const mockGroup = "mockedGroup";
    const mockedRes = [{ name: "User1" }, { name: "User2" }];

    // Mocking different scenarios for getGroup function
    getGroup.mockResolvedValue(mockedRes);

    // Case: group parameter defined
    const mockRequest = {
      headers: () => ({
        get: jest.fn().mockReturnValue(mockGroup),
      }),
      url: "mocked_url", // Mocking the URL without 'num' parameter
    };
    const response = await GET(mockRequest);
    expect(getGroup).toHaveBeenCalledWith(mockGroup);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(JSON.stringify(mockedRes));

    // Case: group parameter undefined
    const undefinedGroupRequest = {
      headers: () => ({
        get: jest.fn().mockReturnValue(undefined),
      }),
      url: "mocked_url", // Mocking the URL without 'num' parameter
    };
    const undefinedGroupResponse = await GET(undefinedGroupRequest);
    expect(getGroup).not.toHaveBeenCalled(); // Ensure getGroup was not called
    expect(undefinedGroupResponse.status).toBe(400);
  });

  it("should handle case 5: Get users without groups", async () => {
    // Set up test data and mocks
    const mockedRes = [{ name: "User3" }, { name: "User4" }];

    // Mocking different scenarios for getGroupOrphans function
    getGroupOrphans.mockResolvedValue(mockedRes);

    // Call the GET function with request case 5
    const mockRequest = {
      headers: () => ({
        get: jest.fn().mockReturnValue(undefined),
      }),
      url: "mocked_url", // Mocking the URL without 'num' parameter
    };
    const response = await GET(mockRequest);

    // Assert the function calls and response
    expect(getGroupOrphans).toHaveBeenCalled();
    expect(response.status).toBe(200);
    expect(response.body).toEqual(JSON.stringify(mockedRes));
  });

  it("should handle case 6: Get all users", async () => {
    // Set up test data and mocks
    const mockedRes = [{ name: "User5" }, { name: "User6" }];

    // Mocking different scenarios for getAllUsers function
    getAllUsers.mockResolvedValue(mockedRes);

    // Call the GET function with request case 6
    const mockRequest = {
      headers: () => ({
        get: jest.fn().mockReturnValue(undefined),
      }),
      url: "mocked_url", // Mocking the URL without 'num' parameter
    };
    const response = await GET(mockRequest);

    // Assert the function calls and response
    expect(getAllUsers).toHaveBeenCalled();
    expect(response.status).toBe(200);
    expect(response.body).toEqual(JSON.stringify(mockedRes));
  });

  it("should handle case 7: Get members under a supervisor", async () => {
    // Set up test data and mocks
    const mockGroup = "mockedGroup";
    const mockedRes = [{ name: "Member1" }, { name: "Member2" }];

    // Mocking different scenarios for getSupervisorTable function
    getSupervisorTable.mockResolvedValue(mockedRes);

    // Call the GET function with request case 7
    const mockRequest = {
      headers: () => ({
        get: jest.fn().mockReturnValue(mockGroup),
      }),
      url: "mocked_url", // Mocking the URL without 'num' parameter
    };
    const response = await GET(mockRequest);

    // Assert the function calls and response
    expect(getSupervisorTable).toHaveBeenCalledWith(mockGroup);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(JSON.stringify(mockedRes));
  });

  it("should handle case 8: Get groups", async () => {
    // Set up test data and mocks
    const mockedRes = [{ name: "Group1" }, { name: "Group2" }];

    // Mocking different scenarios for getGroups function
    getGroups.mockResolvedValue(mockedRes);

    // Call the GET function with request case 8
    const mockRequest = {
      headers: () => ({
        get: jest.fn().mockReturnValue(undefined),
      }),
      url: "mocked_url", // Mocking the URL without 'num' parameter
    };
    const response = await GET(mockRequest);

    // Assert the function calls and response
    expect(getGroups).toHaveBeenCalled();
    expect(response.status).toBe(200);
    expect(response.body).toEqual(JSON.stringify(mockedRes));
  });

  it("should handle case 9: Get given group supervisor information", async () => {
    // Set up test data and mocks
    const mockGroup = "mockedGroup";
    const mockedRes = { supervisor: "John Doe", position: "Manager" };

    // Mocking different scenarios for getSupervisor function
    getSupervisor.mockResolvedValue(mockedRes);

    // Call the GET function with request case 9
    const mockRequest = {
      headers: () => ({
        get: jest.fn().mockReturnValue(mockGroup),
      }),
      url: "mocked_url", // Mocking the URL without 'num' parameter
    };
    const response = await GET(mockRequest);

    // Assert the function calls and response
    expect(getSupervisor).toHaveBeenCalledWith(mockGroup);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(JSON.stringify(mockedRes));
  });
});

describe("POST function tests", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should handle POST request: Register new user", async () => {
    // Set up test data and mocks
    const mockRequestData = {
      username: "testuser",
      email: "test@example.com",
      password: "testpassword",
      // Add other required properties here according to your implementation
    };

    const mockResponse = {
      id: "userId123",
      email: "test@example.com",
      // Mock other necessary response data according to your implementation
    };

    // Mocking different scenarios for signUp function
    signUp.mockResolvedValue(mockResponse);

    // Mocking getUser function for admin check
    getUser.mockResolvedValue({ role: "Admin" });

    // Mocking getGroup function for Supervisor role check
    getGroup.mockResolvedValue([[{ name: "Group1" }]]);

    // Call the POST function with mock request data
    const mockRequest = {
      json: async () => mockRequestData,
      headers: () => ({
        get: jest.fn().mockReturnValue("adminUserId"), // Mock admin ID
      }),
    };

    const response = await POST(mockRequest);

    // Assert the function calls and response
    expect(signUp).toHaveBeenCalledWith(mockRequestData);
    expect(getUser).toHaveBeenCalledWith("adminUserId");
    expect(getGroup).toHaveBeenCalledWith("supervisedGroupId"); // Mocked supervised group ID
    expect(response.status).toBe(200); // Adjust assertions based on your expected responses
    expect(response.body).toEqual("OK");
  });
});

describe("PATCH function tests", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should handle PATCH request: Modify/Edit/Update user data", async () => {
    // Set up test data and mocks
    const mockRequestData = {
      name: "Updated Name",
    };

    const mockResponse = {
      id: "userId123",
    };

    // Mocking different scenarios for modifyUser function
    modifyUser.mockResolvedValue(mockResponse);

    // Call the PATCH function with mock request data
    const mockRequest = {
      json: async () => mockRequestData,
      headers: () => ({
        get: jest.fn().mockReturnValue("mockedUserId"), // Mock user ID
      }),
    };

    const response = await PATCH(mockRequest);

    // Assert the function calls and response
    expect(modifyUser).toHaveBeenCalledWith("mockedUserId", mockRequestData);
    expect(response.status).toBe(200);
    expect(response.body).toEqual("userId123");
  });
});

describe("DELETE function tests", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should handle DELETE request: Delete a user", async () => {
    // Set up test data and mocks
    const mockUserId = "user123";

    // Mocking different scenarios for deleteUser function
    deleteUser.mockResolvedValue(true);

    // Call the DELETE function with mock request data
    const mockRequest = {
      json: async () => ({ id: mockUserId }),
      headers: () => ({
        get: jest.fn().mockReturnValue(undefined),
      }),
    };

    const response = await DELETE(mockRequest);

    // Assert the function calls and response
    expect(deleteUser).toHaveBeenCalledWith({ id: mockUserId });
    expect(response.status).toBe(200);
    expect(response.body).toEqual("OK");
  });

  it("should handle DELETE request: Delete a group", async () => {
    // Set up test data and mocks
    const mockGroupId = "group456";

    // Mocking different scenarios for deleteGroup function
    deleteGroup.mockResolvedValue(true);

    // Call the DELETE function with mock request data for deleting a group
    const mockRequest = {
      json: async () => ({ id: mockGroupId }),
      headers: () => ({
        get: jest.fn().mockReturnValue("group"),
      }),
    };

    const response = await DELETE(mockRequest);

    // Assert the function calls and response
    expect(deleteGroup).toHaveBeenCalledWith({ id: mockGroupId });
    expect(response.status).toBe(200);
    expect(response.body).toEqual("OK");
  });
});
