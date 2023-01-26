export class StringUtils {
  public static makeSortString(str: string): number {
    let sortString =
      str === '곧 도착'
        ? '0'
        : str.split('[')[0].replace('분', '').replace('초후', '');
    if (sortString !== '0' && sortString.length !== 3) {
      sortString = [sortString.slice(0, 1), '0', sortString.slice(1)].join('');
    }
    return Number(sortString);
  }
}