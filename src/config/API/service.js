import { API_HOST } from ".";

export const endpoint = {
    registration : `${API_HOST.url}/auth/signup`,
    login : `${API_HOST.url}/auth/login`,
    forgotPassword : (email) => `${API_HOST.url}/auth/request-password-reset?email_or_phone=${email}`,
    emergency : `${API_HOST.url}/user/emergency`,
    user : `${API_HOST.url}/user/self`,
    province : `${API_HOST.url}/province`,
    district : `${API_HOST.url}/district?province_id=`,
    subdistrict : `${API_HOST.url}/subdistrict?district_id=`,
    village : `${API_HOST.url}/village?subdistrict_id=`,
    editProfile :  `${API_HOST.url}/user/`,
    fcm :  `${API_HOST.url}/user/fcm-token?fcm_token=`,
    service :  `${API_HOST.url}/service`,
    nurse : (service_id, page) =>  `${API_HOST.url}/nurse?service_id=${service_id}&page=${page}`,
    order :  `${API_HOST.url}/order`,
    order_detail : (id) => `${API_HOST.url}/order/${id}`,
    checkout : (id) => `${API_HOST.url}/order/checkout?id=${id}`,
    cancelOrder : (id) => `${API_HOST.url}/order/cancel?id=${id}`,
    acceptOrder : (id) => `${API_HOST.url}/order/accept?id=${id}`,
    report : (id) => `${API_HOST.url}/order/report?id=${id}`,
    rejectOrder : (id) => `${API_HOST.url}/order/reject?id=${id}`,
    doneOrder : (id) => `${API_HOST.url}/order/done?id=${id}`,
    order_income :  `${API_HOST.url}/order/incoming`,
    order_income_by_status : (status) => `${API_HOST.url}/order/incoming?status=${status}`,
    order_ongoing : `${API_HOST.url}/order?ongoing_only=1`,
    changePassword : (password) => `${API_HOST.url}/user/set-password?password=${password}`,
    activity : `${API_HOST.url}/activity`
}
