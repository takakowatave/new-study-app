export default {
    preset: "ts-jest",
    testEnvironment: "jsdom",
    setupFiles: ["dotenv/config"], // ← ここ追加！
    setupFilesAfterEnv: ["./jest.setup.ts"],
    transform: {
      "^.+\\.(ts|tsx)$": "ts-jest",
    },
    moduleNameMapper: {
      "\\.(css|less)$": "identity-obj-proxy",
    },
  };
  