import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { RandomUtils } from 'utils/random.util';
import { StringUtils } from 'utils/string.util';
import { BusIds } from './bus.constants';
import { BusFindResponse } from './bus.response.dto';

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
      const exp = /곧 도착|^1분|^2분|^3분|^4분/;
      let busData = [];
      data.forEach((item) => {
        if (exp.test(item.arrmsg1) && exp.test(item.arrmsg2)) {
          const sort1 = StringUtils.makeSortString(item.arrmsg1);
          const sort2 = StringUtils.makeSortString(item.arrmsg2);
          busData.push([
            {
              busNumber: item.rtNm,
              plateNumber: item.plainNo1,
              eta: item.arrmsg1,
              sort: sort1,
            },
            {
              busNumber: item.rtNm,
              plateNumber: item.plainNo2,
              eta: item.arrmsg2,
              sort: sort2,
            },
          ]);
        }
        if (busData.length !== 6) {
          if (exp.test(item.arrmsg1)) {
            const sort = StringUtils.makeSortString(item.arrmsg1);
            busData.push([
              {
                busNumber: item.rtNm,
                plateNumber: item.plainNo1,
                eta: item.arrmsg1,
                sort,
              },
            ]);
          }
        }
      });
      busInfo.push(...busData.slice(0, 6));
      busData = [];
    }
    const flatBusInfo = busInfo.flat().sort((a, b) => a.sort - b.sort);

    return flatBusInfo.map((item) => BusFindResponse.of(item));
  }
}
