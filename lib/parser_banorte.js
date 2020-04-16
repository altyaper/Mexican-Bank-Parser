import Parser from './parser';

class ParserBanorte extends Parser {

  constructor(content, salt) {
    super(content, salt);
  }

  getPaymentObject(item) {
    const splitted = item.split('\t');
    return splitted;
  }

  getBanorteDate(date) {
    return new Date(date.split('-').reverse().join(','));
  }

  getArrayPaymentsObject(items) {
    return items.reduce((acc, item) => {
      const arrayPayment = this.getPaymentObject(item);
      if (arrayPayment[1]) {
        const finalDate = this.getBanorteDate(arrayPayment[0]);
        const beforeHash = `${arrayPayment[0]}${arrayPayment[1]}${arrayPayment[2]}${arrayPayment[4]}`;
        const obj = {
          date: finalDate,
          reference: arrayPayment[1],
          charge: arrayPayment[2] || '0',
          payment: arrayPayment[3] || '0',
          balance: arrayPayment[4],
          hash: this.hash(beforeHash)
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
