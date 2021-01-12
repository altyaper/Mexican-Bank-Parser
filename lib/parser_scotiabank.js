import Parser from './parser';

class ParserScotiabank extends Parser {
  constructor(props) {
    super(props);
  }

  getPaymentObject(item) {
    return item.split('|').reduce((acc, item) => {
      acc.push(item.trim());
      return acc;
    }, []);;
  }

  getArrayPaymentsObject(items) {
    return items.reduce((acc, item) => {
      const arrayPayment = this.getPaymentObject(item);
      if (arrayPayment) {
        const reference = arrayPayment[5].split('').splice((arrayPayment[5].length - 7), arrayPayment[5].length).join('');
        const regex = new RegExp(/\"/g)
        const description = arrayPayment[9].replace(regex, '');
        const charge = arrayPayment[6] | '0';
        const payment = arrayPayment[6] | '0';
        const balance = arrayPayment[8];
        const date = new Date(arrayPayment[4]);

        const obj = {
          date,
          reference,
          description,
          charge,
          payment,
          balance,
          hash: this.hash(item)
        };
        acc.push(obj);
      }
      return acc;
    }, []);
  }

  parse() {
    const splitted = this.split(this.content);
    const noFirstLine = this.removeFirstLine(splitted);
    return noFirstLine;
  }
}

export default ParserScotiabank;