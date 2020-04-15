import Parser from './parser';

class ParserBanorte extends Parser {

  constructor(props) {
    super(props);
  }

  getPaymentObject(item) {
    const splitted = item.split('\t');
    return splitted;
  }

  getBanorteDate(date) {
    const splitted = date.split('-');
    if (splitted.length > 0) {
      const finalDate = new Date();
      finalDate.setDate(splitted[0]);
      finalDate.setMonth(parseInt(splitted[1]) - 1);
      finalDate.setFullYear(splitted[2]);
      return finalDate;
    }
  }

  getArrayPaymentsObject(items) {
    return items.reduce((acc, item) => {
      const arrayPayment = this.getPaymentObject(item);
      if (arrayPayment[1]) {
        const finalDate = this.getBanorteDate(arrayPayment[0]);
        const obj = {
          date: finalDate,
          reference: arrayPayment[1],
          charge: arrayPayment[2] || '0',
          payment: arrayPayment[3] || '0',
          balance: arrayPayment[4]
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

export default ParserBanorte;
