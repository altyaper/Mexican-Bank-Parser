import Parser from './parser';

class ParserBancomer extends Parser {

    constructor(props) {
      super(props);
    }

    getPaymentObject(item) {
      const splitted = item.split('\t');

      return splitted.reduce((acc, item) => {
        acc.push(item);
        return acc;
      }, []);
    }

    getArrayPaymentsObject(items) {
      return items.reduce((acc, line) => {
        const arrayPayment = this.getPaymentObject(line);
        if (arrayPayment[1]) {
          const obj = {
            date: new Date(arrayPayment[0]),
            reference: arrayPayment[1],
            charge: arrayPayment[2] || '0',
            payment: arrayPayment[3] || '0',
            balance: arrayPayment[4],
            hash: this.hash(arrayPayment.join(''))
          };
          acc.push(obj);
        }
        return acc;
      }, []);
    }

    parse() {
      const splitted = this.split(this.content);
      const noFirstLine = this.removeFirstLine(splitted);
      return this.getArrayPaymentsObject(noFirstLine);
    }
}

export default ParserBancomer;
