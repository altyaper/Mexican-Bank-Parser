import fs from 'fs';
import path from 'path';
import ParserBanamex from '../lib/parser_banamex';
var expect = require('chai').expect;

describe('Parser', () => {
  var content;
  var parser;
  beforeEach((done) => {
    fs.readFile(path.resolve('./test/files/banamex.csv'), 'utf8', (error, data) => {
      content = data;
      parser = new ParserBanamex(content);
      done();
    });
  });

  it('should convert content into an array', () => {
    expect(parser.split()).to.be.an('array');
  });

  it('should remove the first line from the array', () => {
    const splitted = parser.split();
    const noFirstLine = parser.removeFirstLine(splitted);
    expect(noFirstLine).to.be.an('array');
  });

  it('should split line as Banamex line', () => {
    const line = '"05-01-2018","NOUR BISTRO REST         BNO 17012SEBAMX ","7,629.10","","0.00","MXN"\r';
    const object = parser.getPaymentObject(line);
    expect(object[1]).to.be.eql('05-01-2018');
    expect(object[2]).to.be.eql('NOUR BISTRO REST         BNO 17012SEBAMX ');
    expect(object[3]).to.be.eql('7,629.10');
    expect(object[4]).to.be.eql('');
    expect(object[5]).to.be.eql('0.00');
    expect(object[6]).to.be.eql('MXN');
  });

  it('should get an array of payment', () => {
    const splitted = parser.split();
    const noFirstLine = parser.removeFirstLine(splitted);
    const payments = parser.getArrayPaymentsObject(noFirstLine);
    expect(payments).to.be.an('array');
    expect(payments[0]).to.be.an('object');
    expect(payments[0]).to.be.eql({
      date: new Date('06-01-2018'),
      reference: 'PAYPAL *SALESCTE2        4029357711   LU ',
      payment: '4,087.55',
      charge: '0',
      balance: '0.00',
      currency: 'MXN'
    });
  });

});
