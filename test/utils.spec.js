import test from 'ava';
import { domainMatch, pathMatch, isDate } from '../lib/utils';

test('domainMatch()', (t) => {
  t.true(domainMatch('a.com', 'a.com'));
  t.false(domainMatch('a.com', 'b.a.com'));

  t.true(domainMatch('.a.com', 'a.com'));
  t.true(domainMatch('.a.com', 'b.a.com'));
  t.true(domainMatch('.a.com', 'c.b.a.com'));
  t.false(domainMatch('.a.com', 'xxxa.com'));

  t.true(domainMatch('b.a.com', 'b.a.com'));
  t.true(domainMatch('.b.a.com', 'b.a.com'));
  t.true(domainMatch('.b.a.com', 'c.b.a.com'));
  t.false(domainMatch('b.a.com', 'a.com'));

  t.false(domainMatch('com', 'a.com'));
  t.false(domainMatch('.com', 'a.com'));
});

test('checkPath()', (t) => {
  t.true(pathMatch('/', '/'));
  t.true(pathMatch('/', '/path'));
  t.true(pathMatch('/', '/path/to'));

  t.true(pathMatch('/path/', '/path/to'));
  t.true(pathMatch('/path/', '/path/to/it'));
  t.false(pathMatch('/path/', '/'));

  t.true(pathMatch('/path', '/path/to'));
  t.true(pathMatch('/path', '/path/to/it'));
  t.false(pathMatch('/path/', '/'));

  t.false(pathMatch('/path', '/pathxxx'));
});

test('isDate()', (t) => {
  t.true(isDate(new Date()));
  t.true(isDate('Sun, 07 Jan 2018 14:06:05 GMT'));
  t.false(isDate('2018 25:00:00'));
  t.false(isDate('xxx'));
});

