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
    const parts = date.split('/');
    const day = parts[0];
    const monthString = parts[1];
    const year = parts[2];
    const month = this.getMonthFromString(monthString);
    return new Date(year, month - 1, day, 0, 0, 0);
  }

  getMonthFromString(monthString) {
    const monthMap = {
      'Ene.': 1,
      'Feb.': 2,
      'Mar.': 3,
      'Abr.': 4,
      'May.': 5,
      'Jun.': 6,
      'Jul.': 7,
      'Ago.': 8,
      'Sep.': 9,
      'Oct.': 10,
      'Nov.': 11,
      'Dic.': 12
    };
    return monthMap[monthString];
  }

  getReference(description) {
    const regex = new RegExp(/(REFERENCIA: )(\d{7})/gi);
    const matched = regex.exec(description);
    if (matched) {
      return matched[2];
    }
    return '';
  }

  getArrayPaymentsObject(items) {
    return items.reduce((acc, item) => {
      const arrayPayment = this.getPaymentObject(item);
      if (arrayPayment[1]) {
        const finalDate = this.getBanorteDate(arrayPayment[0]);
        const beforeHash = arrayPayment.join('');
        const reference = arrayPayment[3] ? this.getReference(arrayPayment[3]) : '';

        const obj = {
          date: finalDate,
          reference,
          description: arrayPayment[3],
          charge: arrayPayment[4] || '0',
          payment: arrayPayment[5] || '0',
          balance: arrayPayment[6],
          hash: this.hash(beforeHash)
        };
        acc.push(obj);
      }
      return acc;
    }, []);
  }

  parse() {
    const splitted = this.split(this.content);
    return this.getArrayPaymentsObject(splitted);
  }

}

export default ParserBanorte;
