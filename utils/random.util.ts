export class RandomUtils {
  public static randomNumber(min, max): number[] {
    const numbers = [];
    while (numbers.length < 3) {
      const number = Math.floor(Math.random() * (max - min)) + min;
      if (!numbers.includes(number)) {
        numbers.push(number);
      } else {
        continue;
      }
    }
    return numbers;
  }
}
