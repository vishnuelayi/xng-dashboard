import { test, expect } from "@playwright/test";

const CSVMock = `XLogs ID,XLogs Status,First Name,Last Name,Date of Birth,Gender,Grade,School Name,District of Liability,Student ID,Medicaid ID,Parental Consent,Parental Consent Date,Primary Disability,Secondary Disability,Tertiary Disability,Billing Block Term,Has Physical Therapy Prescription,Physical Therapy Prescription Start Date,Physical Therapy Prescription End Date,Physical Therapy Prescribing Provider NPI,Physical Therapy Prescribing Provider Name,Has Occupational Therapy Prescription,Occupational Therapy Prescription Start Date,Occupational Therapy Prescription End Date,Occupational Therapy Prescribing Provider NPI,Occupational Therapy Prescribing Provider Name,Has Speech Therapy Prescription,Speech Therapy Prescription Start Date,Speech Therapy Prescription End Date,Speech Therapy Prescribing Provider NPI,Speech Therapy Prescribing Provider Name,Has Audiology Prescription,Audiology Prescription Start Date,Audiology Prescription End Date,Audiology Prescribing Provider NPI,Audiology Prescribing Provider Name
8685ee5a-ea4b-4b6b-af5d-ca75cdea731c,Inactive,First 1,Last,01/01/2001,Male,PreK,,,123456,,NoneSelected,,,,,Yes,,,,,,,,,,,,,,,,,,,,
4e08d602-1ce2-47f2-90e4-8c17252dadc7,Active,Jalen,Devers,11/07/2016,Male,Other,,,1721284,714712418,NoneSelected,,(02) Other Health Impairment,,,Yes,False,,,,,False,,,,,False,,,,,False,,,,
3ca55882-e366-4958-b52d-2375699ae12f,Active,Jessa,Smith,09/08/2007,Female,Ninth,,,102453,528096361,NoneSelected,,(05) Deaf/Blind,(01) Orthopedic Impairment,(09) Speech Impairment,Yes,True,,,,,True,,,,,False,,,,,False,,,,
0b3a89f6-43c9-4413-888f-6cb66e80e40e,Active,Angela,Roberts,07/19/2010,Female,Seventh,,,028408,531026580,NoneSelected,,(02) Other Health Impairment,(06) Intellectual Disability,,Yes,False,,,,,True,,,,,True,,,,,False,,,,
afa16efb-aae7-4a42-a383-9faccf3cd578,Active,Green,Jacob,06/30/2012,Male,Fourth,,,1736613,613444096,NoneSelected,,(03) Auditory Impairment,(09) Speech Impairment,,Yes,False,,,,Amanda Carpenter,False,,,,Amanda Carpenter,False,,,,,False,,,,
f1b6c89c-5296-4c8c-944b-a4380e4b92e5,Active,Jessica,Oliver,06/16/2006,Female,Ninth,,,PR250154,526763350,NoneSelected,,(03) Auditory Impairment,(09) Speech Impairment,,Yes,,,,,,,,,,,,,,,,,,,,
`;

const tableDataMock = {
  pageRecords: [
    {
      firstName: "First 1",
      lastName: "Last",
      xLogsId: "8685ee5a-ea4b-4b6b-af5d-ca75cdea731c",
      studentId: "123456",
      dateOfBirth: "2001-01-01T06:00:00+00:00",
      gender: 0,
      grade: 0,
      districtOfLiability: null,
      campus: null,
      medicaidId: null,
      isMedicaidEligible: false,
      spedStatus: null,
      xLogsStatus: 2,
      parentalConsentStatus: 3,
      parentalConsentDate: "",
      personalCareOrdered: null,
      transportationOrdered: null,
      primaryDisability: null,
      secondaryDisability: null,
      tertiaryDisability: null,
      okToBillMedicaid: "Yes",
      hasAudiologyPrescription: null,
      audiologyPrescriptionStartDate: null,
      audiologyPrescriptionEndDate: null,
      audiologyPrescribingProviderName: null,
      audiologyPrescribingProviderNPI: null,
      hasOccupationalTherapyPrescription: null,
      occupationalTherapyPrescriptionStartDate: null,
      occupationalTherapyPrescriptionEndDate: null,
      occupationalTherapyPrescribingProviderName: null,
      occupationalTherapyPrescribingProviderNPI: null,
      hasPhysicalTherapyPrescription: null,
      physicalTherapyPrescriptionStartDate: null,
      physicalTherapyPrescriptionEndDate: null,
      physicalTherapyPrescribingProviderName: null,
      physicalTherapyPrescribingProviderNPI: null,
      hasSpeechTherapyPrescription: null,
      speechTherapyPrescriptionStartDate: null,
      speechTherapyPrescriptionEndDate: null,
      speechTherapyPrescribingProviderName: null,
      speechTherapyPrescribingProviderNPI: null,
    },
  ],
  pageNumber: 1,
  pageSize: 1,
  totalRecords: 1,
  totalPages: 1,
};

/**
 * the code for handling the walk me popup is duplicated for each test
 * because it causes errors for some reason and preventing certain routes from being intercepted
 */
const password = process.env.UserPass || process.env.REACT_APP_USERPASS;
const email = process.env.REACT_APP_USEREMAIL || "test@msbconnect.com";
const url = process.env.Url || "http://localhost:3000/";

test.describe("Account Student Report Polling Systems", () => {
  test.beforeEach(async ({ page }) => {
    await page.context().storageState({ path: "storageState.json" });
    /**
     * we manually go to the reports url because playwright does not support testing multiple windows or tabs
     * The normal user flow is to click the reports tab, which opens another browser tab,
     * and that causes issues with playwright
     */
    await page.goto(`${url}xlogs/reports?header-title=Static%20Reports`);

    // going to the reports page triggers a login flow sometimes, use below code if that happens
    // await page.getByPlaceholder("Email Address").click();
    // await page.getByPlaceholder("Email Address").fill(email);
    // await page.getByPlaceholder("Password").click();
    // await page.getByPlaceholder("Password").fill(password);
    // await page.getByRole("button", { name: "Sign in" }).click();
    await page.waitForLoadState();
    await page.getByRole("button", { name: "Account Student Report" }).click();
  });

  test("Successful CSV Download", async ({ page }) => {
    const queueReportResponsePromise = page.waitForResponse(
      (res) => res.url().includes("/QueueReport") && res.status() === 202,
    );
    await page.route("**", async (route) => {
      // we want to test the DownloadCSV route specifically
      if (route.request().url().includes("AccountStudents/GetReport/TexasUI")) {
        return route.abort();
      }
      if (route.request().url().includes("DownloadCSV")) {
        return await route.fulfill({
          status: 200,
          body: CSVMock,
          contentType: "text/csv",
        });
      }
    });
    // const queueReportResponsePromise = page.waitForResponse((res) => res.url().includes("/QueueReport") && res.status() === 202);
    // a walkme popup shows here sometimes
    const walkmePopup = page.locator(".wm-shoutout").getByText("Close", { exact: true });
    const queueReportResponse = await queueReportResponsePromise;

    await page.waitForTimeout(500);
    if (await walkmePopup.isVisible()) {
      await walkmePopup.click();
      await walkmePopup.isHidden();
    }

    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: "Export to CSV" }).click();
    const download = await downloadPromise;

    await page.getByRole("button", { name: "Okay" }).click();

    const date = new Date().toLocaleDateString().split("/").join("_");
    expect(download.suggestedFilename()).toBe(`AccountStudentReport_${date}.csv`);
  });

  test("Failed CSV Download", async ({ page }) => {
    await page.route("**", async (route) => {
      // we want to test the DownloadCSV route specifically
      if (route.request().url().includes("AccountStudents/GetReport/TexasUI")) {
        return await route.abort();
      }
      if (route.request().url().includes("DownloadCSV")) {
        return await route.fulfill({
          status: 400,
          body: CSVMock,
          contentType: "text/csv",
        });
      }
    });

    // a walkme popup shows here sometimes
    const walkmePopup = page.locator(".wm-shoutout").getByText("Close", { exact: true });
    await page.waitForResponse((res) => res.url().includes("/QueueReport") && res.status() === 202);

    await page.waitForTimeout(500);
    if (await walkmePopup.isVisible()) {
      await walkmePopup.click();
      await walkmePopup.isHidden();
    }

    await page.getByRole("button", { name: "Export to CSV" }).click();
    await page.waitForTimeout(500);

    const cancelButton = page.getByRole("button", { name: "Cancel" });

    expect(await cancelButton.isVisible()).toBe(true);

    await cancelButton.click();
    await page.waitForTimeout(200);

    expect(await cancelButton.isVisible()).toBe(false);
  });

  test("Successful Table Data Response", async ({ page }) => {
    await page.route("**", async (route) => {
      // we want to test the TexasUI route specifically
      if (route.request().url().includes("AccountStudents/GetReport/TexasUI")) {
        return await route.fulfill({
          status: 200,
          body: JSON.stringify(tableDataMock),
          contentType: "application/json",
        });
      }
    });

    // const loadingText = page.getByText(
    //   "Hang tight! We're gathering info for youThis will only be a moment. You can use ",
    // );
    // expect(await loadingText.isVisible()).toBe(true);

    // a walkme popup shows here sometimes
    const walkmePopup = page.locator(".wm-shoutout").getByText("Close", { exact: true });
    await page.waitForResponse((res) => res.url().includes("/QueueReport") && res.status() === 202);
    await page.waitForResponse((res) => res.url().includes("/TexasUI") && res.status() === 200);

    await page.waitForTimeout(500);
    if (await walkmePopup.isVisible()) {
      await walkmePopup.click();
      await walkmePopup.isHidden();
    }

    expect(await page.getByText("8685ee5a-ea4b-4b6b-af5d-ca75cdea731c").isVisible()).toBe(true);
  });
});
