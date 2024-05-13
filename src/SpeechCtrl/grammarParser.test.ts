import { describe, expect, test } from 'vitest'
import { parse } from './grammarParser';

const tests = [
  ['a4', 'a4'],
  ['a2 a4', 'a2a4'],
  ['a2 na a4', 'a2a4'],
  ['pion a4', 'a4'],
  ['pion na a4', 'a4'],
  ['pionek na a4', 'a4'],

  ['król na e1', 'ke1'],
  ['goniec na e1', 'be1'],
  ['laufer na e1', 'be1'],
  ['skoczek na e1', 'ne1'],
  ['koń na e1', 'ne1'],
  ['wieża na e1', 're1'],
  ['pion na e1', 'e1'],
  ['pionek na e1', 'e1'],

  ['b3 c4', 'b3c4'],
  ['b3 na c4', 'b3c4'],
  ['skoczek na c4', 'nc4'],
  ['skoczek c4', 'nc4'],
  ['skoczek z b3 c4', 'nb3c4'],
  ['skoczek z b3 na c4', 'nb3c4'],

  ['b3 bije c4', 'b3xc4'],
  ['skoczek z b3 bije c4', 'nb3xc4'],
  ['b3 bije piona z c4', 'b3xc4<!pc4>'],
  ['b3 bije laufra na c4', 'b3xc4<!bc4>'],
  ['koń z b3 bije piona z c4', 'nb3xc4<!pc4>'],
  ['odbijam skoczkiem z b3', 'nb3x?'],

  ['a8 z promocją na hetmana', 'a8=q'],
  ['a7 a8 z promocją na hetmana', 'a7a8=q'],
  ['pion na a8 z promocją na hetmana', 'a8=q'],
  ['a7 na a8 z promocją na hetmana', 'a7a8=q'],
  ['b7 bije a8 z promocją na hetmana', 'b7xa8=q'],
  ['b7 bije wieżę na a8 z promocją na hetmana', 'b7xa8<!ra8>=q'],
  ['b7 bije wieżę na a8 z promocją na królową', 'b7xa8<!ra8>=q'],
  ['odbijam pionem z b7 z promocją na damę', 'pb7x?=q'],

  ['roszada długa', 'O-O-O'],
  ['roszada hetmańska', 'O-O-O'],
  ['roszada na skrzydle hetmańskim', 'O-O-O'],
  ['roszada krótka', 'O-O'],
  ['roszada królewska', 'O-O'],
  ['roszada na skrzydle królewskim', 'O-O'],
  ['bicie w przelocie', 'enpassant'],

  ['graj białymi', 'side=w'],
  ['graj czarnymi', 'side=b'],
  ['zmień stronę', 'side=!'],
  ['start', 'start'],
  ['rozpocznij grę', 'start'],
  ['poddaję się', 'resign'],
  ['poddaję', 'resign'],
  ['rezygnuję', 'resign'],
  ['zagrajmy jeszcze raz', 'rematch'],
  ['rewanż', 'rematch'],
];

describe('correct parsing to SAN', () => {
  for (const [text, san] of tests) {
    test(`${text} -> ${san}`, () => {
      expect(parse(text)).toEqual(san);
    });
  }
});
