
const msalMock = {
    PublicClientApplication: jest.fn().mockImplementation(() => {
        return {
            getActiveAccount: jest.fn(),
            getAllAccounts: jest.fn().mockReturnValue([]),
            enableAccountStorageEvents: jest.fn(),
            addEventCallback: jest.fn(),
        };
    }),
}

/* 
 --isolatedModules is enabled, and it requires each file to be a module. 
 However, our file ‘mocks.ts’ is being treated as a script because it doesn’t have any import or export statements at the top level, 
 which makes it not a module.
 
 SOLUTION
 The export {} statement doesn’t actually export anything, but it makes TypeScript treat the file as a module, which should resolve the error.
*/
export {}

module.exports = {
    msalMock,
}