import path from 'path';
import fs from 'fs';
import ParserSantander from '../lib/parser_santander';
import { expect } from 'chai';

describe('ParserSantander', () => {
  var content;
  var parser;
  beforeEach((done) => {
    fs.readFile(path.resolve('./test/files/santander.csv'), 'utf8', (error, data) => {
      content = data;
      parser = new ParserSantander(content);
      done();
    });
  });

  it('should parse a bancomer file', () => {
    expect(parser.split()).to.be.an('array');
  });

  it('should parser a line correctly', () => {
    const line = '70519876550     ,02012020,0242,0560,MY REFERENCE                           ,-,650.00,67705.02,00000000,                   DIC 2019                                                               ,                                        ,                    ,                                        ,                    ,                                        ,  ,                              ,               ,               ,';
    const object = parser.getPaymentObject(line);
    expect(object[1]).to.be.eql('02012020');
    expect(object[4]).to.be.eql('MY REFERENCE');
    expect(object[5]).to.be.eql('-');
    expect(object[6]).to.be.eql('650.00');
    expect(object[7]).to.be.eql('67705.02');
  });

  it('should display the date correctly', () => {
    const date = parser.getSantanderDate('02012020');
    expect(date.getDate()).to.be.eql(2);
    expect(date.getMonth()).to.be.eql(0);
    expect(date.getFullYear()).to.be.eql(2020);
  });
});
