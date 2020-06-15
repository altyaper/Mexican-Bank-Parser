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

    getBancomerDate(date) {
      const splitted = date.split('-');
      return new Date(`${splitted[1]}-${splitted[0]}-${splitted[2]}`);
    }

    getArrayPaymentsObject(items) {
      return items.reduce((acc, line) => {
        const arrayPayment = this.getPaymentObject(line);
        if (arrayPayment[1]) {
          const date = this.getBancomerDate(arrayPayment[0]);
          const obj = {
            date,
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
