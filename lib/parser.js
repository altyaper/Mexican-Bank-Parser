import md5 from 'md5';

class Parser {

  constructor(content) {
      this.content = content;
      this.payments = [];
  }

  getContent() {
    return this.content;
  }

  getPayments() {
    return this.payments;
  }

  // Split all content of the file by \n
  split() {
    if (this.content) {
      const splitted = this.content.split('\n');
      this.payments = splitted;
      return splitted;
    }
  }

  // remove first line of the array
  removeFirstLine(array) {
    array.splice(0, 1);
    return array;
  }

  reverseResults(items) {
    return items.reverse();
  }

  hash(line) {
    return md5(line);
  }

}

export default Parser;
