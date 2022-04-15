function testTheThings(){
    let allSheetData = constructSheetData()

    let localData = allSheetData.localData
    let remoteData = allSheetData.data

    let remoteDataData = remoteData.getData()
    let remoteDataHeaders = remoteData.getHeaders()
    // localData.setHeaders(remoteDataHeaders)  Unfortunately, this doesn't work (yet)
    let thisWeeksData = getThisWeeksData_(remoteDataData)
    let deduped = removeDuplicates(thisWeeksData)
    localData.setData(deduped);
}

function testBattery() {
    let startTime = new Date()
    console.log("Starting All Tests")
    let tests = {
        tmm: updateTMMReport,
        techSquad: updateTechSquadReport,
        serviceRep: updateServiceRepReport,
    }
    for (let entry in tests) {
        let test = tests[entry]
        console.log("beginning test for",entry)
        test()
    }
    let endTime = new Date()
    console.log("tests finished, took ",endTime.getTime()-startTime.getTime()," milliseconds")
}


function testNewHeader(){
    // step one: target the right sheet:
    let targetSheet: sheetDataEntry = sheetDataConfig.local.headerTest
    // step two: open the spreadsheet long enough to delete the target.

    let spreadsheet = SpreadsheetApp.openById(targetSheet.sheetId);
    let sheet = spreadsheet.getSheetByName(headerTest.tabName);
    if (sheet != null) {
        spreadsheet.deleteSheet(sheet);
    }

    // step three: create a rawSheetData class.
    let rawSheetData = new RawSheetData(targetSheet.tabName, targetSheet.headerRow, targetSheet.initialColumnOrder);
    let headerTestSheet = new SheetData(rawSheetData);
    // at this point, it should be done!
    console.log("go check the header on sheet ",targetSheet.tabName)
}
function updateTMMReport() {
    let allSheetData = constructSheetData()
    let remoteDataSheet = allSheetData.data

    let remoteData = remoteDataSheet.getData()
    let kicData = new kiDataClass(remoteData)
    let tmmReport = allSheetData.tmmReport

    let tmmReportData = kicData.removeDuplicates().getThisWeeksData().addShortLang().calculateCombinedName().calculateRR().end

    tmmReport.setData(tmmReportData)
}

function updateTechSquadReport() {
    let allSheetData = constructSheetData();
    let remoteDataSheet = allSheetData.data;

    let remoteData = remoteDataSheet.getData();
    let kicData = new kiDataClass(remoteData);
    let techReport = allSheetData.fbReferrals;


    let startDate = new Date("2022-01-20"); // TODO: I forgot what day we actually started calculating these
    let refData = kicData.removeDuplicates().removeBeforeDate(startDate).calculateCombinedName().end;

    techReport.setData(refData);
}


function updateServiceRepReport() {
    let allSheetData = constructSheetData()
    let remoteDataSheet = allSheetData.data;

    let remoteData = remoteDataSheet.getData();
    let kicData = new kiDataClass(remoteData);
    let serviceReport = allSheetData.serviceRep

    let startDate = new Date("2022-01-20")
    let serviceData = kicData.removeDuplicates().removeBeforeDate(startDate).calculateCombinedName().end

    serviceReport.setData(serviceData)
}
function getSundayOfCurrentWeek() {
    const today = new Date();
    const first = today.getDate() - today.getDay() + 1;
    const last = first + 6;

    const monday = new Date(today.setDate(first));
    console.log(monday); // 👉️ Mon Jan 17 2022

    const sunday = new Date(today.setDate(last - 8));
    console.log(sunday);
    return sunday;
}



