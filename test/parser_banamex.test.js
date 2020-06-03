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
    const line = '"05-01-2018","NOUR BISTRO REST         BNO 17012SEBAMX ","7,629.10","","0.00","MXN"\r';
    const object = parser.getPaymentObject(line);
    expect(object[1]).to.be.eql('05-01-2018');
    expect(object[2]).to.be.eql('NOUR BISTRO REST         BNO 17012SEBAMX');
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
      date: new Date('01-13-2018'),
      reference: 'NOUR BISTRO REST         BNO 170124EBAMX',
      payment: '7,629.10',
      charge: '0',
      balance: '0.00',
      currency: 'MXN',
      hash: '028a6c5efef2b434d18c094ed3e562a8'
    });
  });

  it('should parser a content correctly', () => {
    const final = parser.parse();
    expect(final[final.length - 1]).to.be.eql({
      date: new Date('2018-01-13T07:00:00.000Z'),
      reference: 'NOUR BISTRO REST         BNO 170124EBAMX',
      payment: '7,629.10',
      charge: '0',
      balance: '0.00',
      currency: 'MXN',
      hash: '028a6c5efef2b434d18c094ed3e562a8'
    });
  });

});
