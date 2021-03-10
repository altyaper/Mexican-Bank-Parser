import Parser from './parser';
import { CSVtoArray } from '../util/functions';

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

  getReference(description) {
    if (!description) return '';
    return description.split('').splice(-7).join('');
  }

  getArrayPaymentsObject(items) {
    return items.reduce((acc, item) => {
      const arrayPayment = CSVtoArray(item);
      if (arrayPayment) {
        const isCharge = (arrayPayment[5] == '+') ? false : true;
        const charge = isCharge ? arrayPayment[6] : '0';
        const payment = isCharge ? '0' : arrayPayment[6];
        const balance = arrayPayment[7];
        const cleanDescription = (arrayPayment[10]).replace(/\"/g, '');
        const description = (`${arrayPayment[4]} ${arrayPayment[9]} ${cleanDescription} ${arrayPayment[14]} ${arrayPayment[18]}`).trim();
        const reference = this.getReference(arrayPayment[8]);
        const hashValues = `${arrayPayment[4]} ${arrayPayment[9]}`;

        const regex = /\'/gi;
        const date = arrayPayment[1].replace(regex, '');

        const obj = {
          date: this.getSantanderDate(date),
          description,
          reference,
          charge,
          payment,
          balance,
          hash: this.hash(hashValues)
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
