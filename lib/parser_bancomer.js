import Parser from './parser';

class ParserBa extends Parser {

    constructor(props) {
        super(props);
    }

    getPaymentObject(item) {
      const splitted = item.split('"');
      return splitted.reduce((acc, item) => {
        if (item !== ',' && item !== '\r') {
          acc.push(item);
        }
        return acc;
      }, []);
    }

    getArrayPaymentsObject(items) {
      return items.reduce((acc, item) => {
        const arrayPayment = this.getPaymentObject(item);
        if (arrayPayment[1]) {
          const obj = {
            date: new Date(arrayPayment[1]),
            reference: arrayPayment[2],
            payment: arrayPayment[3] || '0',
            charge: arrayPayment[4] || '0',
            balance: arrayPayment[5],
            currency: arrayPayment[6]
          };
          acc.push(obj);
        }
        return acc;
      }, []);
    }

    parse() {
      const splitted = this.split(this.content);
      const noFirstLine = this.removeFirstLine(splitted);
      const arrayObjects = this.getArrayPaymentsObject(noFirstLine);
      return this.reverseResults(arrayObjects);
    }
}

export default ParserBa;
