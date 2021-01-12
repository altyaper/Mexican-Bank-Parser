import ParserBanamex from './parser_banamex';
import ParserBanorte from './parser_banorte';
import ParserSantander from './parser_santander';
import ParserBancomer from './parser_bancomer';
import ParserScotiabank from './parser_scotiabank';

const banks = {
  banamex: ParserBanamex,
  banorte: ParserBanorte,
  santander: ParserSantander,
  bancomer: ParserBancomer,
  scotiabank: ParserScotiabank
};

export default banks;
