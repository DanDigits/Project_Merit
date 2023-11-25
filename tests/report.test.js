/* eslint-disable no-undef */
import {
  createReport,
  getReport,
  getUserReports,
  deleteReport,
  modifyReport,
  pullReports,
} from "../server/mongodb/actions/Report";
import mongoDB from "../dbConnection";
import ReportSchema from "/server/mogodb/actions/models/Report";

jest.mock("../dbConnection"); // Mock the MongoDB connection

describe("Report Functions", () => {
  beforeEach(() => {
    // Clear all mock calls and instances between tests
    jest.clearAllMocks();
  });

  it("should create a report", async () => {
    // Mock the behavior of ReportSchema.create
    const mockReportData = {
      title: "Newreport",
      content: "This is a new report",
    };

    ReportSchema.create.mockResolvedValueOnce({ mockReportData });

    const reportData = {
      title: "Report Data",
      content: "This is the data for a report",
    };

    const report = await createReport(reportData);

    expect(mongoDB).toHaveBeenCalledTimes(1); // Ensure mongoDB() was called
    expect(ReportSchema.create).toHaveBeenCalledWith(reportData);
    expect(report).toEqual({ mockReportData });
  });

  it("should get a report by ID", async () => {
    // Mock the behavior of ReportSchema.findById
    ReportSchema.findById.mockResolvedValueOnce({ mockReportData });

    const reportId = "someReportId";
    const report = await getReport(reportId);

    expect(mongoDB).toHaveBeenCalledTimes(1); // Ensure mongoDB() was called
    expect(ReportSchema.findById).toHaveBeenCalledWith(reportId);
    expect(report).toEqual({ mockReportData });
  });

  it("should get user reports", async () => {
    // Mock the behavior of ReportSchema.find
    ReportSchema.find.mockResolvedValueOnce([{ mockReportData }]);

    const userEmail = "user@example.com";
    const reports = await getUserReports(userEmail);

    expect(mongoDB).toHaveBeenCalledTimes(1); // Ensure mongoDB() was called
    expect(ReportSchema.find).toHaveBeenCalledWith({ userEmail });
    expect(reports).toEqual([{ mockReportData }]);
  });

  it("should delete a report", async () => {
    const reportId = "someReportId";
    const mockUserUpdateReport = { email: "user@example.com" };

    const mockDeletedReport = { _id: "someReportId" };
    // Mock the behavior of ReportSchema.findByIdAndDelete
    ReportSchema.findByIdAndDelete.mockImplementation(async (query) => {
      if (query._id === "someReportId") {
        return mockDeletedReport; // Simulating report deletion
      }
    });

    const result = await deleteReport(reportId);

    expect(ReportSchema.findByIdAndDelete).toHaveBeenCalledWith({
      _id: "someReportId",
    });
    expect(updateUserReportStatistics).toHaveBeenCalledWith("user@example.com");
    expect(result).toEqual([{ _id: "someReportId" }, undefined]);
  });

  it("should modify report", async () => {
    const reportId = "someReportId";
    const modifiedReportData = {
      // Modified report data
      title: "Modified Title",
      content: "Modified Description",
    };

    const mockedUpdatedReport = {
      _id: reportId,
      ...modifiedReportData,
      email: "user@example.com",
    };

    // Mock the behavior of ReportSchema.findByIdAndUpdate to simulate report modification
    ReportSchema.findByIdAndUpdate.mockResolvedValueOnce(mockedUpdatedReport);

    const result = await modifyReport(reportId, modifiedReportData);

    expect(ReportSchema.findByIdAndUpdate).toHaveBeenCalledWith(
      reportId,
      modifiedReportData,
      { new: true }
    );
    expect(updateUserReportStatistics).toHaveBeenCalledWith("user@example.com");
    expect(result).toEqual(mockedUpdatedReport);
  });

  it("should pull reports based on report IDs", async () => {
    const reportId = { id: ["reportId1", "reportId2"] };
    const mockReportsData = [
      await getReport("reportId1"),
      await getReport("reportId2"),
    ];

    // Mock the behavior of ReportSchema.findById to simulate pulling reports
    ReportSchema.findById.mockImplementation(async (query) => {
      const reportIndex = reportId.id.indexOf(query._id);
      if (reportIndex !== -1) {
        return mockReportsData[reportIndex];
      }
    });

    const reports = await pullReports(reportId);

    expect(ReportSchema.findById).toHaveBeenCalledTimes(2); // Assuming 2 reports are queried
    expect(ReportSchema.findById).toHaveBeenCalledWith({ _id: "reportId1" });
    expect(ReportSchema.findById).toHaveBeenCalledWith({ _id: "reportId2" });
    expect(reports).toEqual(mockReportsData);
  });
});
