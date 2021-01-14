import Parser from './parser';

class ParserSantander extends Parser {

  constructor(props) {
    super(props);
  }

  getPaymentObject(item) {
    const splitted = item.split(',');
    return splitted.reduce((acc, item) => {
      acc.push(item.trim());
      return acc;
    }, []);
  }

  getRangeFromString(S, min, max) {
    return parseInt(S.split('').splice(min, max).join(''));
  }

  getSantanderDate(data) {
    const day = this.getRangeFromString(data, 0, 2);
    const month = this.getRangeFromString(data, 2, 2);
    const year = this.getRangeFromString(data, 4, 4);
    return new Date(Date.UTC(year, month - 1, day + 1, 0, 0, 0));
  }

  getArrayPaymentsObject(items) {
    return items.reduce((acc, item) => {
      const arrayPayment = this.getPaymentObject(item);
      if (arrayPayment) {
        const description = `${arrayPayment[4]} ${arrayPayment[9]}`;
        const isCharge = (arrayPayment[5] == '+') ? false : true;
        const charge = isCharge ? arrayPayment[6] : '0';
        const payment = isCharge ? '0' : arrayPayment[6];
        const balance = arrayPayment[7];
        const reference = (arrayPayment[8] || '').split('').splice(arrayPayment[8].length - 7, arrayPayment[8].length).join('');

        const regex = /\'/gi;
        const date = arrayPayment[1].replace(regex, '');

        const obj = {
          date: this.getSantanderDate(date),
          description,
          reference,
          charge,
          payment,
          balance,
          hash: this.hash(description)
        };
        acc.push(obj);
      }
      return acc;
    }, []);
  }

  parse() {
    const splitted = this.split(this.content);
    const noFirstLine = this.removeFirstLine(splitted);
    return this.getArrayPaymentsObject(noFirstLine).reverse();
  }

}

export default ParserSantander;
