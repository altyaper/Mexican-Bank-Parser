import Parser from './parser';

class ParserBanamex extends Parser {

    constructor(props) {
        super(props);
    }

    getPaymentObject(item) {
      const splitted = item.split('"');
      return splitted.reduce((acc, item) => {
        if (item !== ',' && item !== '\r') {
          acc.push(item.trim());
        }
        return acc;
      }, []);
    }

    getBanamexDate(date) {
      const splitted = date.split('-');
      const dateString = `${splitted[1]}-${splitted[0]}-${splitted[2]}`;
      return new Date(dateString);
    }

    getArrayPaymentsObject(items) {
      return items.reduce((acc, item) => {
        const arrayPayment = this.getPaymentObject(item);
        if (arrayPayment[1]) {
          const finalDate = this.getBanamexDate(arrayPayment[1]);
          const obj = {
            date: finalDate,
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

export default ParserBanamex;
