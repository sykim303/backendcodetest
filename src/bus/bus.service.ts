import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { RandomUtils } from 'utils/random.util';
import { BusIds } from './bus.constants';

@Injectable()
export class BusService {
  constructor(private readonly httpService: HttpService) {}
  async getBusStopInfo() {
    const serviceKey =
      'GGw58UOnRwx4EftqiTrQ7LFYo6ATZicDZ5H4IG%2F16UAy0m9ExsZys530QgmoUfvQkJQAO4WV71IHRnJpEndp1w%3D%3D';
    const randomIdxs = RandomUtils.randomNumber(0, BusIds.length);
    const busInfo = [];
    for await (const idx of randomIdxs) {
      const busRouteId = BusIds[idx][1];
      const url = `http://ws.bus.go.kr/api/rest/arrive/getArrInfoByRouteAll?ServiceKey=${serviceKey}&busRouteId=${busRouteId}&resultType=json`;
      const response = await this.httpService.axiosRef.get(url);
      if (response.data.msgHeader.headerCd !== '0') {
        throw new BadRequestException(response.data.msgHeader.headerMsg);
      }
      const data = response.data.msgBody.itemList;

      let busData = [];
      data.forEach((item) => {
        if (
          Number(item.traTime1) > 0 &&
          Number(item.traTime1) < 300 &&
          Number(item.traTime2) > 0 &&
          Number(item.traTime2) < 300
        ) {
          busData.push([
            {
              busNumber: item.rtNm,
              plateNumber: item.plainNo1,
              eta: Number(item.traTime1),
              msg: item.arrmsg1,
            },
            {
              busNumber: item.rtNm,
              plateNumber: item.plainNo2,
              eta: Number(item.traTime2),
              mag: item.arrmsg2,
            },
          ]);
        }
        if (busData.length !== 6) {
          if (Number(item.traTime1) > 0 && Number(item.traTime1) < 300) {
            busData.push([
              {
                busNumber: item.rtNm,
                plateNumber: item.plainNo1,
                eta: Number(item.traTime1),
                msg: item.arrmsg1,
              },
            ]);
          }
        }
      });
      busInfo.push(...busData.slice(0, 6));
      busData = [];
    }
    const flatBusInfo = busInfo.flat().sort((a, b) => a.eta - b.eta);

    return flatBusInfo;
  }
}
