export class BusFindResponse {
  busNumber: string;
  plateNumber: string;
  eta: string;

  public static of(data: any) {
    const response: BusFindResponse = new BusFindResponse();

    response.busNumber = data.busNumber;
    response.plateNumber = data.plateNumber;
    response.eta = data.eta;

    return response;
  }
}
