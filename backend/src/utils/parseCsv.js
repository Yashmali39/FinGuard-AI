import { parse } from "csv-parse/sync";
import ApiError from "./ApiError.js";

const parseCsv = (buffer) => {
    if (!buffer) {
        throw new ApiError(400, "CSV file is required");
    }

    try {
        const csvText = buffer.toString("utf-8");

        const records = parse(csvText, {
            columns: true,
            skip_empty_lines: true,
            trim: true,
        });

        if (records.length === 0) {
            throw new ApiError(400, "CSV file contains no transaction data");
        }

        return records;
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }

        throw new ApiError(400, "Invalid CSV file");
    }
};

export default parseCsv;