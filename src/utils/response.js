import { COMMON_MSG, HTTP_STATUS_CODES } from "../constants/constants.js";

export const sendSuccessResponse = async(res,statusCode,message=COMMON_MSG.OK,data={}) => {
    return res.status(statusCode || HTTP_STATUS_CODES.OK).json({
        success:true,
        message,
        data
    })
}


export const sendErrorResponse = async(res,statusCode,message=COMMON_MSG.ERROR_RESPONSE,data={}) => {
    return res.status(statusCode || HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        success:false,
        message,
        data
    })
}