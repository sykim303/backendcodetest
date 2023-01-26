export class StringUtils {
  public static makeSortString(str: string): number {
    let sortString =
      str === '곧 도착'
        ? '0'
        : str
            .split('[')[0]
            .replace('분', '')
            .replace('초후', '')
            .replace('후', '');
    if (sortString !== '0' && sortString.length === 1) {
      sortString = sortString + '00';
    }
    if (sortString.length === 2) {
      sortString = [sortString.slice(0, 1), '0', sortString.slice(1)].join('');
    }
    console.log(sortString);
    return Number(sortString);
  }
}
