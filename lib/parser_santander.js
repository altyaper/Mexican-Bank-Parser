import Parser from './parser';

class ParserSantander extends Parser {

  constructor(props) {
    super(props);
  }

  getPaymentObject(item) {
    const splitted = item.split(',');
    return splitted.reduce((acc, item) => {
      acc.push(item.trim());
      return acc;
    }, []);
  }

  getSantanderDate() {
    return new Date.now();
  }

  getArrayPaymentsObject(items) {
    return items.reduce((acc, item) => {
      const arrayPayment = this.getPaymentObject(item);
      if (arrayPayment) {
        const reference = `${arrayPayment[4]} ${arrayPayment[8]} ${arrayPayment[9]}`;
        const isCharge = (arrayPayment[5] == '+') ? false : true;
        const charge = isCharge ? arrayPayment[6] : '0';
        const payment = isCharge ? '0' : arrayPayment[6];
        const balance = arrayPayment[7];

        const obj = {
          date: this.getSantanderDate(),
          reference,
          charge,
          payment,
          balance,
          hash: this.hash(reference)
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

export default ParserSantander;
