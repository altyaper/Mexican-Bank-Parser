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
      return new Date(`${splitted[1]}-${splitted[0]}-${splitted[2]}`);
    }

    getReference(description) {
      const regex = new RegExp(/(D INT )(\d{7})/gi);
      const match = regex.exec(description);
      if (match) {
        return match[2];
      }
      return '';
    }

    cleanNumber(number) {
      return parseFloat(number.replace(/,/gi, ''));
    }

    getArrayPaymentsObject(items) {
      return items.reduce((acc, item) => {
        const arrayPayment = this.getPaymentObject(item);
        if (arrayPayment[1]) {
          const finalDate = this.getBanamexDate(arrayPayment[1]);
          const reference = arrayPayment[2] ? this.getReference(arrayPayment[2]) : '';
          const obj = {
            date: finalDate,
            reference,
            description: arrayPayment[2],
            payment: this.cleanNumber(arrayPayment[3]) || '0',
            charge: this.cleanNumber(arrayPayment[4]) || '0',
            balance: this.cleanNumber(arrayPayment[5]),
            currency: arrayPayment[6],
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
      const arrayObjects = this.getArrayPaymentsObject(noFirstLine);
      return this.reverseResults(arrayObjects);
    }
}

export default ParserBanamex;
