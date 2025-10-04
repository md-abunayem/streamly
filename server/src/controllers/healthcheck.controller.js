import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


//Need to update later
const healthcheck = asyncHandler(async (req, res) => {

    
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { status: "OK", timestamp: new Date().toISOString() },
                "Service is healthy and running"
            )
        );
});

export {
    healthcheck
};