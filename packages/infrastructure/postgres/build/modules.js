"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostgresModule = void 0;
const data_source_1 = require("./data-source");
class PostgresModule {
    async init() {
        await data_source_1.AppDataSource.initialize();
    }
    register() {
    }
}
exports.PostgresModule = PostgresModule;
//# sourceMappingURL=modules.js.map