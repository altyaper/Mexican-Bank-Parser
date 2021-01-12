import path from 'path';
import fs from 'fs';
import ParserScotiabank from '../lib/parser_scotiabank';
import { expect } from 'chai';

describe.only('Scotiabank', () => {
  var content;
  var parser;
  beforeEach((done) => {
    fs.readFile(path.resolve('./test/files/scotiabank.txt'), 'utf8', (error, data) => {
      content = data;
      parser = new ParserScotiabank(content);
      done();
    });
  });

  it('should parse a scotiabank file', () => {
    expect(parser.split()).to.be.an('array');
  });

  it('should parser a line correctly', (done) => {
    const line = '"CHQ"|"MXN"|000|00000021505639271|"2020/11/03"|00000000000000221101|600.00|"Abono"|243975.57|"SWEB TRASPASO ENTRE CUENTAS"||||""';
    const object = parser.getPaymentObject(line);
    done()
  });

  it('should hash the previous hash that we had before', () => {
    const line = ['"CHQ"|"MXN"|000|00000021505639271|"2020/11/03"|00000000000000221101|600.00|"Abono"|243975.57|"SWEB TRASPASO ENTRE CUENTAS"||||""'];
    const object = parser.getArrayPaymentsObject(line);
    expect(object[0].reference).to.be.eql('0221101');
    expect(object[0].description).to.be.eql('SWEB TRASPASO ENTRE CUENTAS');
    expect(object[0].hash).to.be.eql('0927129f55312231bc452c7f5686c699');
    expect(object[0].date.getDate()).to.be.eql(3);
    expect(object[0].date.getMonth()).to.be.eql(10);
    expect(object[0].date.getFullYear()).to.be.eql(2020);
  });
});