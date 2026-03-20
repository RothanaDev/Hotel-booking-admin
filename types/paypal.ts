export type PaypalCreateOrderResponse = {
    orderId: string;
    approvalUrl: string;
};

export type PaypalCaptureResponse = {
    orderId: string;
    captureId: string | null;
    status: string;
};
