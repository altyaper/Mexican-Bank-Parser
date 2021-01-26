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

    getReference(description) {
      const regex = new RegExp(/ \d+/gi);
      const numbers = description.match(regex);
      return numbers[1].split('').splice(0, 8).join('').trim();
    }

    getTEFReference(description) {
      return this.getReference(description);
    }

    getSPEIReference(description) {
      return this.getReference(description);
    }

    getPracticReference(description) {
      const regex = new RegExp(/\d{7}/gi);
      return description.match(regex)[0] || '';
    }

    getCashReference(description) {
      const number = description.split('/')[1] || '';
      return number.split('').splice(number.length - 7, number.length).join('');
    }

    getThirdReference(description) {
      const number = description.split('/')[1] || '';
      const last = number.split(' ').splice(-1)[0];
      const regex = new RegExp(/\d{7}/gi);
      const match = last.match(regex);
      return match ? last.match(regex)[0] : '';
    }

    getBancomerReference(description) {
      let reference = '';
      // Check TEF
      if (description.includes('TEF')) {
        reference = this.getTEFReference(description);
      }

      // Check SPEI
      if (description.includes('SPEI')) {
        reference = this.getSPEIReference(description);
      }

      if (description.includes('DEPOSITO EFECTIVO PRACTIC')) {
        reference = this.getPracticReference(description);
      }

      if (description.includes('DEPOSITO EN EFECTIVO')) {
        reference = this.getCashReference(description);
      }

      if (description.includes('PAGO CUENTA DE TERCERO')) {
        reference = this.getThirdReference(description);
      }

      return reference;
    }

    cleanNumber(number) {
      return parseFloat(number.replace(/,/gi, ''));
    }

    getArrayPaymentsObject(items) {
      return items.reduce((acc, line) => {
        const arrayPayment = this.getPaymentObject(line);
        if (arrayPayment[1]) {
          const date = this.getBancomerDate(arrayPayment[0]);
          const reference = this.getBancomerReference(arrayPayment[1]);
          const obj = {
            date,
            reference,
            description: arrayPayment[1],
            charge: this.cleanNumber(arrayPayment[2]) || 0,
            payment: this.cleanNumber(arrayPayment[3]) || 0,
            balance: this.cleanNumber(arrayPayment[4]) || 0,
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
