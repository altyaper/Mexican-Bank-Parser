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

  removeQuotes(string) {
    const regex = new RegExp(/\"/g)
    return string.replace(regex, '');
  }

  getArrayPaymentsObject(items) {
    return items.reduce((acc, item) => {
      const arrayPayment = this.getPaymentObject(item);
      if (arrayPayment[0]) {
        const reference = arrayPayment[5].split('').splice((arrayPayment[5].length - 7), arrayPayment[5].length).join('');
        const description = `${this.removeQuotes(arrayPayment[9])} ${this.removeQuotes(arrayPayment[5])} ${this.removeQuotes(arrayPayment[13])}`;
        const isCharge = arrayPayment[7] === '"Abono"' ? false : true;
        const charge = isCharge ? arrayPayment[6] : '0';
        const payment = !isCharge ? arrayPayment[6] : '0';
        const balance = arrayPayment[8];
        const date = new Date(arrayPayment[4]);

        const obj = {
          date,
          reference,
          description: description.trim(),
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
    return this.getArrayPaymentsObject(noFirstLine).reverse();
  }
}

export default ParserScotiabank;
