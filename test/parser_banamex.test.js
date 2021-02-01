import fs from 'fs';
import path from 'path';
import ParserBanamex from '../lib/parser_banamex';
import { expect } from 'chai';

describe('ParserBanamex', () => {
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
    const line = '"25-01-2021","D INT 1230121 PAGO CUOTA AUT.417206","","15,000.00","50,162.64","MXN"';
    const object = parser.getPaymentObject(line);
    expect(object[1]).to.be.eql('25-01-2021');
    expect(object[2]).to.be.eql('D INT 1230121 PAGO CUOTA AUT.417206');
    expect(object[3]).to.be.eql('');
    expect(object[4]).to.be.eql('15,000.00');
    expect(object[5]).to.be.eql('50,162.64');
    expect(object[6]).to.be.eql('MXN');
  });

  it('should get an array of payment', () => {
    const splitted = parser.split();
    const noFirstLine = parser.removeFirstLine(splitted);
    const payments = parser.getArrayPaymentsObject(noFirstLine);
    expect(payments).to.be.an('array');
    expect(payments[0]).to.be.an('object');
  });

  it('should get the right payment object', () => {
    const lines = ['"25-01-2021","D INT 1230121 PAGO CUOTA AUT.417206","","15,000.00","50,162.64","MXN"'];
    const object = parser.getArrayPaymentsObject(lines);
    expect(object[0]).to.be.eql({
      date: new Date(2021, 0, 25, 0, 0, 0),
      description: 'D INT 1230121 PAGO CUOTA AUT.417206',
      reference: '1230121',
      payment: '0',
      charge: 15000.00,
      balance: 50162.64,
      currency: 'MXN',
      hash: '7864d449c95dab3b8357b28b0dcb60cf'
    });
  })

});
