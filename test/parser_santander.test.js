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

  it('should hash the previous hash that we had before', () => {
    const line = ["065507051987,'15072020',16:06,'7465',AB TRANSF SPEI                          ,+,400.00,136475.39,006128183      ,L2538                                    058597000006909835                               ,\"BANCO REGIONAL DE MONTERREY, SA         \",014150655070519870  ,COMITE SERATTA 36 ETAPA 1 AC            ,058597000006909835  ,MIGUEL ANGEL AVITIA REAZA               ,  ,                              ,CST160223SP0   ,AIRM790104TE   ,058-15/07/2020/15-998VO86897  "];
    const object = parser.getArrayPaymentsObject(line);
    expect(object[0]).to.be.eql({
      date: new Date(Date.UTC(2020, 6, 16, 0, 0, 0)),
      description: 'AB TRANSF SPEI 136475.39 006128183',
      reference: '6128183',
      payment: '400.00',
      charge: '0',
      balance: '136475.39',
      hash: '0382f9a1d1eb8f4a310f4235ecd98dfe'
    });
  });

});
