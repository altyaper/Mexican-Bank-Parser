import Parser from './parser';

class ParserBanorte extends Parser {

  constructor(content, salt) {
    super(content, salt);
  }

  getPaymentObject(item) {
    const splitted = item.split(',');
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

  cleanNumber(number) {
    return number.replace('$', '').replace(',', '');
  }

  CSVtoArray(text) {
    var re_valid = /^\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*(?:,\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*)*$/;
    var re_value = /(?!\s*$)\s*(?:'([^'\\]*(?:\\[\S\s][^'\\]*)*)'|"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^,'"\s\\]*(?:\s+[^,'"\s\\]+)*))\s*(?:,|$)/g;

    // Return NULL if input string is not well formed CSV string.
    if (!re_valid.test(text)) return null;

    var a = []; // Initialize array to receive values.
    text.replace(re_value, // "Walk" the string using replace with callback.
        function (m0, m1, m2, m3) {

            // Remove backslash from \' in single quoted values.
            if (m1 !== undefined) a.push(m1.replace(/\\'/g, "'"));

            // Remove backslash from \" in double quoted values.
            else if (m2 !== undefined) a.push(m2.replace(/\\"/g, '"'));
            else if (m3 !== undefined) a.push(m3);
            return ''; // Return empty string.
        });

    // Handle special case of empty last value.
    if (/,\s*$/.test(text)) a.push('');
    return a;
};

  getArrayPaymentsObject(items) {
    return items.reduce((acc, item) => {
      const arrayPayment = this.CSVtoArray(item);
      if (arrayPayment[1]) {
        const finalDate = this.getBanorteDate(arrayPayment[0]);
        const beforeHash = arrayPayment.join('');
        const reference = arrayPayment[3] ? this.getReference(arrayPayment[3]) : '';

        const obj = {
          date: finalDate,
          reference,
          description: arrayPayment[3] ? arrayPayment[3].trim() : '',
          charge: this.cleanNumber(arrayPayment[4]) || '0',
          payment: this.cleanNumber(arrayPayment[5]) || '0',
          balance: this.cleanNumber(arrayPayment[6]) || '0',
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
