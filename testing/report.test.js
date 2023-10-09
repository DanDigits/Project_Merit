import { createReport, getReport, getUserReports } from '/server/mongodb/actions/Report';
import mongoDB from '../dbConnection';
import ReportSchema from '/server/mogodb/actions/models/Report';

jest.mock('../dbConnection'); // Mock the MongoDB connection

describe('Report Functions', () => {
  beforeEach(() => {
    // Clear all mock calls and instances between tests
    jest.clearAllMocks();
  });

  it('should create a report', async () => {
    // Mock the behavior of ReportSchema.create
    const mockReportData = {
      title: 'Newreport',
      content: 'This is a new report',
    };

    ReportSchema.create.mockResolvedValueOnce({mockReportData});

    const reportData = { 
      title: 'Report Data',
      content: 'This is the data for a report',
    };

    const report = await createReport(reportData);

    expect(mongoDB).toHaveBeenCalledTimes(1); // Ensure mongoDB() was called
    expect(ReportSchema.create).toHaveBeenCalledWith(reportData);
    expect(report).toEqual({mockReportData});
  });

  it('should get a report by ID', async () => {
    // Mock the behavior of ReportSchema.findById
    ReportSchema.findById.mockResolvedValueOnce({mockReportData});

    const reportId = 'someReportId';
    const report = await getReport(reportId);

    expect(mongoDB).toHaveBeenCalledTimes(1); // Ensure mongoDB() was called
    expect(ReportSchema.findById).toHaveBeenCalledWith(reportId);
    expect(report).toEqual({mockReportData});
  });

  it('should get user reports', async () => {
    // Mock the behavior of ReportSchema.find
    ReportSchema.find.mockResolvedValueOnce([{mockReportData}]);

    const userEmail = 'user@example.com';
    const reports = await getUserReports(userEmail);

    expect(mongoDB).toHaveBeenCalledTimes(1); // Ensure mongoDB() was called
    expect(ReportSchema.find).toHaveBeenCalledWith({ userEmail });
    expect(reports).toEqual([{mockReportData}]);
  });
});
